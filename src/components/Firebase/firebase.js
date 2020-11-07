// Contains all methods for communicating with the Firebase Authentication and Realtime Database

import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.functions = app.functions();
  }

  /*              *** AUTHENTICATION METHODS ***                            */
  getUid = () => this.auth.currentUser.uid;

  //Create user with Firebase Authentication
  doCreateUserWithEmailAndPassword = (email, password) => {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  //Add user to website, put basic user data in Users database
  doRegisterUser = (email, password, username, role) => {
    return this.doCreateUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.userRef(authUser.user.uid).set({ username, email, role });
      })
      .catch((error) => {
        throw error;
      });
  };

  //Sign in user with Firebase Authentication
  doSignInWithEmailAndPassword = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  //Sign out user with Firebase Authentication
  doSignOut = () => this.auth.signOut();

  //Send passwoord reset email through Firebase Authentication
  doPasswordReset = (email) => {
    return this.auth.sendPasswordResetEmail(email);
  };

  //Reauthenticate user with Firebase Authentication for sensitive functions
  doReauthenticate = (email, password) => {
    var credential = app.auth.EmailAuthProvider.credential(email, password);
    return this.auth.currentUser.reauthenticateWithCredential(credential);
  };

  //Change a user's password with Firebase Authentication
  doPasswordUpdate = (password) => {
    return this.auth.currentUser.updatePassword(password);
  };

  /*              *** USERS DATA METHODS ***                            */

  userRef = (uid) => this.db.ref(`users/${uid}`);
  currentRef = () => this.db.ref("users/" + this.getUid());

  usersRef = () => this.db.ref("users");

  //Set contact information
  //Methods: callNumber, google, skype, textNumber, zoom
  doSetContacts = (methods) => {
    return this.db.ref("/users-contacts/" + this.getUid()).update(methods);
  };

  //Set preferred contact method. Must have contact info available for it
  //method can be "callNumber" "google" "skype" "textNumber" or "zoom"
  doSetPreferredContact = (method) => {
    return this.db
      .ref("/users-contacts/" + this.getUid())
      .update({ preferred: method });
  };

  //Retrieve contact information for the user, only works for the user's own info (for now)
  doGetContacts = (uid) => {
    return this.db.ref("/users-contacts/" + uid).once("value");
  };

  /*              *** STATUS METHODS ***                          */

  //Get status of this user or solver
  getStatus = () => this.currentRef().once("value");

  //Check if a solver is currently working
  isWorking = () => {
    return this.getStatus()
      .then((status) => {
        return !!status.val().working;
      })
      .catch((error) => {
        throw error;
      });
  };

  //Check if a solver is currently solving a question
  isMatched = () => {
    return this.getStatus()
      .then((status) => {
        return !!status.val().matched;
      })
      .catch((error) => {
        throw error;
      });
  };

  //Check if the user is currently asking an open/current question
  isAsking = () => {
    return this.getStatus()
      .then((status) => {
        return !!status.val().current;
      })
      .catch((error) => {
        throw error;
      });
  };

  //Let solver start working
  doStartWorking = () => {
    var beginWorking = this.functions.httpsCallable("beginWorking");
    return beginWorking();
  };

  //Let solver finish working. Can't stop if still working on a problem.
  doStopWorking = () => {
    var stopWorking = this.functions.httpsCallable("stopWorking");
    return stopWorking();
  };

  /*              *** USER'S QUESTION METHODS ***                            */

  //Have the user ask a new question. Can only have one new question at one time
  doAskQuestion = (
    application,
    details,
    device,
    deviceType,
    hardware,
    software,
    title
  ) => {
    //Generate question id
    var newQuestionKey = this.db.ref().child("full-questions").push().key;
    var updates = {};

    //First update open-questions
    var questionData = {
      askedTime: app.database.ServerValue.TIMESTAMP,
      deviceType: deviceType,
      title: title,
      user: this.getUid(),
      hardware: hardware,
      software: software,
    };
    if (hardware) {
      questionData.device = device;
    }
    if (software) {
      questionData.application = application;
    }

    updates["/open-questions/" + newQuestionKey] = JSON.parse(
      JSON.stringify(questionData)
    );

    //Then update user-questions
    var userData = {
      askedTime: app.database.ServerValue.TIMESTAMP,
      deviceType: deviceType,
      title: title,
      state: "open",
    };
    updates[
      "/user-questions/" + this.getUid() + "/" + newQuestionKey
    ] = userData;

    //Finally, update full-questions
    questionData.details = details;
    questionData.state = "open";
    updates["/full-questions/" + newQuestionKey] = questionData;

    //Update the user's current question
    updates["/users/" + this.getUid() + "/current"] = newQuestionKey;

    //Update questions
    return this.db.ref().update(updates);
  };

  //Get all non-open, non-current questions for the current user
  doGetUserFinishedQuestions = () => {
    return this.db
      .ref("/user-questions/" + this.getUid())
      .orderByChild("state")
      .equalTo("finished")
      .once("value");
  };

  //Get all questions for the current user
  doGetUserQuestions = () => {
    return this.db.ref("/user-questions/" + this.getUid()).once("value");
  };

  //Get details of a current question
  doGetCurrentQuestion = (qid) => {
    return this.db.ref("/current-questions/" + qid).once("value");
  };

  //Get full details of a question
  doGetQuestion = (qid) => {
    return this.db.ref("/full-questions/" + qid).once("value");
  };

  /*              *** USER'S SOLVER SELECTION METHODS ***                    */

  //Get all potential solvers
  doGetPotentialSolverIds = (qid) => {
    return this.db
      .ref("/open-questions/" + qid + "/potentialSolvers")
      .orderByKey()
      .limitToFirst(5)
      .once("value");
  };

  //Get a solver profile
  doGetSolverProfile = (uid) => {
    return this.db.ref("/solver-profiles/" + uid).once("value");
  };

  //Get all potential solver profiles
  doGetPotentialSolverProfiles = (qid) => {
    return this.doGetPotentialSolverIds(qid)
      .then((solvers) => {
        var profiles = [];
        var promises = [];
        solvers.forEach((solver) => {
          promises.push(
            this.doGetSolverProfile(solver.val()).then((profile) => {
              var nextProfile = profile.val();
              nextProfile["uid"] = solver.val();
              return profiles.push(nextProfile);
            })
          );
        });
        return Promise.all(promises).then(() => {
          return profiles;
        });
      })
      .catch((error) => {
        throw error;
      });
  };

  //Get matched solver id
  doGetMatchedSolverId = (qid) => {
    return this.db.ref("/current-questions/" + qid + "/solver").once("value");
  };

  //Get matched solver profile
  //Profile contains ratings, short description, and username
  doGetMatchedSolverProfiles = (qid) => {
    return this.doGetMatchedSolverId(qid)
      .then((solver) => {
        return this.doGetSolverProfile(solver.val());
      })
      .catch((error) => {
        throw error;
      });
  };

  //Set matched solver
  doSelectSolver = (qid, solverId) => {
    return this.db
      .ref("/open-questions/" + qid + "/chosenSolver")
      .set(solverId);
  };

  /*              *** SOLVER'S QUESTION METHODS ***                          */

  //View all open questions
  doGetOpenQuestions = () => {
    return this.db
      .ref("/open-questions/")
      .orderByKey()
      .limitToFirst(25)
      .once("value");
  };

  //View details of an open question
  doGetOpenQuestion = (qid) => {
    return this.db.ref("/open-questions/" + qid).once("value");
  };

  //Retrieve the solver's potentially matched question (needs user approval)
  doGetPotentialQuestion = () => {
    return this.db.ref("/users/" + this.getUid() + "/potential").once("value");
  };

  //Make a selection and save it in the users database
  doMakeSelection = (qid) => {
    return this.db
      .ref("/users/" + this.getUid() + "/potential")
      .set(qid)
      .then(() => {
        return this.db
          .ref("/open-questions/" + qid + "/potentialSolvers/")
          .push(this.getUid());
      })
      .catch((error) => {
        throw error;
      });
  };

  //Select an open question to try working on it (Need to wait 2 minutes before switching choices)
  doSelectPotentialQuestion = (qid) => {
    var chooseQuestion = this.functions.httpsCallable("chooseQuestion");
    return chooseQuestion({ qid: qid });
  };

  //Listen for user approval or denial of a potential question match
  //Calls useResults with a boolean, whether the solver was chosen or not
  onQuestionMatched = (qid, useResults) => {
    var solverRef = this.db.ref("/open-questions/" + qid + "/chosenSolver");
    var uid = this.getUid();
    solverRef.on("value", (newValue) => {
      //Only use callback when the solver has been chosen
      if (newValue.exists()) {
        useResults(newValue.val() === uid);
      }
    });
  };

  //Get current question being worked on
  doGetMatchedQuestion = () => {
    return this.db.ref("/users/" + this.getUid() + "/matched").once("value");
  };

  //Let solver close a current question
  doSolveQuestion = (qid) => {
    var finishQuestion = this.functions.httpsCallable("makeFinishedQuestion");
    return finishQuestion({ qid: qid });
  };

  /*              *** INSTANT MESSAGING METHODS ***                          */

  //Retrieve last 100 messages (deprecated, try onMessageSent)
  //Returns a snapshot list of messages, each containing sender: uid, and text: message
  doGetMessages = (qid) => {
    return this.db
      .ref("/conversations/" + qid)
      .orderByKey()
      .limitToLast(100)
      .once("value");
  };

  //Send a message
  doSendMessage = (qid, text) => {
    var mid = this.db.ref("/conversations/" + qid).push().key;
    var messageData = {
      sender: this.getUid(),
      text: text,
    };
    return this.db.ref("/conversations/" + qid + "/" + mid).set(messageData);
  };

  //Retrieve any unretrieved messages as they come in
  //Triggered for every existing message and every future new message
  onMessageSent = (qid, useMessage) => {
    var conversationRef = this.db.ref("/conversations/" + qid);
    conversationRef.on("child_added", (newMessage) => {
      useMessage(newMessage.val());
    });
  };

  //Get all of a question's communication methods shared by the user and solver
  //Returns a snapshot list, ordered alphabetically by the name of the methods
  //Snapshot returned could be null if no methods are shared
  doGetSharedContactMethods = (qid) => {
    return this.db
      .ref("/current-questions/" + qid + "/communication")
      .orderByValue()
      .once("value");
  };

  //Get question's preferred communication method, available for user and solver
  doGetSharedPreferredMethod = (qid) => {
    return this.db
      .ref("/current-questions/" + qid + "/communication/preferred")
      .once("value");
  };

  /*              *** RATING METHODS ***                          */

  //Get ratings (only one main rating for now)
  doGetMainRating = (uid) => {
    return this.db.ref("/solver-profiles/" + uid + "/mainRating").once("value");
  };

  //Set main rating
  doGiveRatings = (qid, rating) => {
    var giveRating = this.functions.httpsCallable("giveMainRating");
    return giveRating({ mainRating: rating, qid: qid });
  };

  /*              *** PRICING METHODS ***                          */

  //Get the user's current estimated price for a question
  doGetCurrentPrice = (qid) => {
    var getEstimate = this.functions.httpsCallable("estimatePrice");
    return getEstimate({ qid: qid });
  };

  //Get the solver's current estimated price for a question
  doGetCurrentPayout = (qid) => {
    var getEstimate = this.functions.httpsCallable("estimatePayout");
    return getEstimate({ qid: qid });
  };

  //Get the user's final price for a finished question (not including tip paid)
  doGetSubtotalPrice = (qid) => {
    return this.doGetQuestion(qid)
      .then((question) => {
        return question.val().basePrice;
      })
      .catch((error) => {
        throw error;
      });
  };

  //Set the tip amount to be added to final prices and payouts
  doSetTip = (qid, tip) => {
    return this.db.ref("/full-questions/" + qid).update({ tip: tip });
  };

  //Get the solver's final price for a finished question (not including tip)
  doGetSubtotalPayout = (qid) => {
    return this.doGetQuestion(qid)
      .then((question) => {
        return question.val().basePayout;
      })
      .catch((error) => {
        throw error;
      });
  };

  //Retrieve the tip amount chosen
  doGetTip = (qid) => {
    return this.db.ref("/full-questions/" + qid + "/tip").once("value");
  };

  //Retrieve the total final price
  doGetTotalPrice = (qid) => {
    return this.db.ref("/full-questions/" + qid + "/userTotal").once("value");
  };

  //Retrieve the total final payout
  doGetTotalPayout = (qid) => {
    return this.db.ref("/full-questions/" + qid + "/solverTotal").once("value");
  };

  /*              *** SOLVER DATA METHODS ***                          */

  //Update a solver's talents
  doUpdateTalents = (newTalents) => {
    var uid = this.getUid();
    var updatedTalents = {};
    for (var id in newTalents) {
      if (id.startsWith("new")) {
        this.db.ref("/solver-talents/" + uid).push(newTalents[id]);
      } else {
        updatedTalents[id] = newTalents[id];
      }
    }
    return this.db.ref("/solver-talents/" + uid).update(updatedTalents);
  };

  //Delete a certain talent from a solver's talents
  doRemoveTalent = (oldTalent) => {
    return this.db
      .ref("/solver-talents/" + this.getUid() + "/" + oldTalent)
      .remove();
  };

  //Get all of the current solver's talents
  doGetTalents = () => {
    return this.db.ref("/solver-talents/" + this.getUid()).once("value");
  };

  //Update a short public profile paragraph for the solver
  doSetProfileDescription = (description) => {
    return this.db
      .ref("/solver-profiles/" + this.getUid())
      .update({ description: description });
  };

  //Get a short public profile paragraph for the solver
  doGetProfileDescription = () => {
    return this.db.ref("/solver-profiles/" + this.getUid()).once("value");
  };
}

export default Firebase;
