"use strict";

// These fictional messages are displayed as text, never as active links.
const scenarios = [
  {
    type: "EMAIL MESSAGE",
    from: "Account Support <security@account-check.example>",
    subject: "Urgent: Your account will be locked",
    message: "Hello,\n\nWe detected unusual activity. Your account will be locked in 30 minutes unless you verify your password now.\n\nVerify at: account-check.example/login\n\nAccount Support",
    explanation: "The short deadline and request for your password are red flags. Report the message using your organization's or email provider's reporting tools, then delete it. If you're concerned, visit the service through its known website or app."
  },
  {
    type: "TEXT MESSAGE",
    from: "+1 (202) 555-0148",
    subject: "Delivery update",
    message: "Delivery Notice: Your package is on hold due to an unpaid $1.95 fee. Pay now to avoid return: parcel-fee.example/pay",
    explanation: "Unexpected delivery fees and an unfamiliar link are common phishing tricks. Report the text using your carrier's or device's reporting tools, then delete it. Check the delivery in the retailer's or carrier's official app instead."
  },
  {
    type: "EMAIL MESSAGE",
    from: "Morgan, Finance <morgan@company-payments.example>",
    subject: "Quick favor — gift cards needed",
    message: "Hi,\n\nI'm in a meeting and need you to buy gift cards for a client right away. Send me the card numbers and don't call — it's a surprise.\n\nThanks,\nMorgan",
    explanation: "A request for gift card numbers, secrecy, and urgency is a major warning sign, even if the name looks familiar. Report the message, then delete it. Verify the request by contacting Morgan through a known number or another trusted channel."
  },
  {
    type: "TEXT MESSAGE",
    from: "+1 (202) 555-0162",
    subject: "Security alert",
    message: "Your bank: A new device is trying to sign in. Reply with the six-digit security code we just sent you to cancel the login.",
    explanation: "A one-time security code can be used to access your account. Never share it in response to an unexpected message. Report the text, delete it, and contact your bank using the number on your card or its official app."
  },
  {
    type: "EMAIL MESSAGE",
    from: "Rewards Team <prizes@winner-rewards.example>",
    subject: "You've won a free laptop!",
    message: "Congratulations!\n\nYou've been selected for a free laptop. Claim it today by entering your address and card details to cover a small shipping fee.\n\nClaim here: winner-rewards.example/claim",
    explanation: "An unexpected prize that asks for personal or payment information is suspicious. Report the message and then delete it. Don't use the link or provide your details."
  },
  {
    type: "EMAIL MESSAGE",
    from: "IT Service Desk <helpdesk@staff-access.example>",
    subject: "Action required: Mailbox storage upgrade",
    message: "Hi,\n\nYour mailbox is nearly full. To prevent incoming messages from being blocked, please review and approve your storage upgrade before 5 p.m. today.\n\nReview storage: staff-access.example/mailbox\n\nThank you,\nIT Service Desk",
    explanation: "The unexpected deadline and unfamiliar sign-in address are warning signs. Report the message, then delete it. Check your mailbox or contact your IT team through a known channel rather than following the link."
  },
  {
    type: "EMAIL MESSAGE",
    from: "Accounts Payable <billing@vendor-invoices.example>",
    subject: "Updated banking details for invoice 1048",
    message: "Hello,\n\nPlease note that our bank account details have changed. To avoid a delay in processing invoice 1048, use the new payment instructions in the attached document for all future payments.\n\nPlease confirm once the change has been made.\n\nAccounts Payable",
    explanation: "Unexpected changes to payment details can be an impersonation attempt, even if the invoice looks familiar. Don't open the attachment or update payment details. Report the message and verify the request with the vendor using a previously known phone number."
  },
  {
    type: "EMAIL MESSAGE",
    from: "Shared Documents <notifications@file-review.example>",
    subject: "A document has been shared with you",
    message: "Hello,\n\nA document titled \"Q4 Planning - Confidential\" has been shared with you. To view it, sign in with your work email and password using the link below.\n\nOpen document: file-review.example/shared/4826\n\nThis link will expire tomorrow.",
    explanation: "A document you weren't expecting and a sign-in request on an unfamiliar site are clues that your password may be targeted. Report the message, then delete it. Ask the supposed sender through a trusted channel or check your usual document-sharing app."
  }
];

const quizQuestions = [
  {
    question: "What is phishing?",
    options: ["A way to speed up your internet connection", "A trick used to steal information or money by pretending to be trustworthy", "A routine software update", "A secure way to share passwords"],
    answer: 1,
    explanation: "Phishing uses deception to get you to share information, send money, or open a harmful link or file."
  },
  {
    question: "Which message is most likely to be suspicious?",
    options: ["A message asking you to urgently share your password", "A reminder you expected from a service you use", "A conversation you started with a known contact", "A message you verified through an official app"],
    answer: 0,
    explanation: "Urgency and requests for passwords are common phishing warning signs."
  },
  {
    question: "How should you check an unexpected account alert?",
    options: ["Click the link in the message", "Reply with your login details", "Open the service's known website or app yourself", "Send the message to friends and ask them to click it"],
    answer: 2,
    explanation: "Use a known website, official app, or trusted phone number instead of contact details in the suspicious message."
  },
  {
    question: "What should you do with a suspicious message?",
    options: ["Forward it to everyone you know", "Report it using the appropriate reporting tool, then delete it", "Reply and ask if it is real", "Open the attachment to investigate"],
    answer: 1,
    explanation: "Reporting can help protect others. After reporting, delete the message without opening its links or attachments."
  },
  {
    question: "Which practice helps protect your accounts?",
    options: ["Using the same password everywhere", "Sharing one-time codes with anyone who asks", "Turning off security alerts", "Using unique passwords and multi-factor authentication"],
    answer: 3,
    explanation: "Unique passwords and multi-factor authentication add layers of protection. Never share a one-time code with someone who asks for it."
  }
];

const byId = (id) => document.getElementById(id);
let scenarioIndex = 0;
let scenarioScore = 0;
let scenarioAnswered = false;
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
let scenariosCompleted = 0;
let questionsCompleted = 0;
let completionDate = null;

function updateProgress(prefix, completed, total, current) {
  byId(`${prefix}-count`).textContent = `${current} / ${total}`;
  byId(`${prefix}-progress`).setAttribute("aria-valuemax", total);
  byId(`${prefix}-progress`).setAttribute("aria-valuenow", completed);
  byId(`${prefix}-progress-fill`).style.width = `${(completed / total) * 100}%`;
}

function updateTrainingProgress() {
  const completed = scenariosCompleted + questionsCompleted;
  const total = scenarios.length + quizQuestions.length;
  const percent = Math.round(completed / total * 100);
  const description = `${completed} of ${total} activities completed`;
  byId("training-count").textContent = description;
  byId("training-percent").textContent = `${percent}%`;
  byId("training-progress").setAttribute("aria-valuenow", percent);
  byId("training-progress").setAttribute("aria-valuetext", description);
  byId("training-progress-fill").style.width = `${percent}%`;

  if (scenariosCompleted === scenarios.length && questionsCompleted === quizQuestions.length) {
    if (!completionDate) completionDate = new Date();
    byId("certificate-date").textContent = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(completionDate);
    byId("certificate-locked").hidden = true;
    byId("certificate-unlocked").hidden = false;
  }
}

function showFeedback(element, correct, explanation) {
  element.classList.toggle("incorrect", !correct);
  element.replaceChildren();
  const heading = document.createElement("strong");
  heading.textContent = correct ? "That's right." : "Not quite. Here's the safer choice.";
  const detail = document.createElement("span");
  detail.textContent = explanation;
  element.append(heading, detail);
  element.hidden = false;
}

function renderScenario() {
  const scenario = scenarios[scenarioIndex];
  scenarioAnswered = false;
  byId("scenario-content").hidden = false;
  byId("scenario-complete").hidden = true;
  byId("scenario-type").textContent = scenario.type;
  byId("scenario-from").textContent = scenario.from;
  byId("scenario-subject-label").textContent = scenario.type === "TEXT MESSAGE" ? "TOPIC" : "SUBJECT";
  byId("scenario-subject").textContent = scenario.subject;
  byId("scenario-message").textContent = scenario.message;
  byId("scenario-feedback").hidden = true;
  byId("scenario-next").hidden = true;
  byId("scenario-choices").querySelectorAll("button").forEach((button) => { button.disabled = false; });
  updateProgress("scenario", scenarioIndex, scenarios.length, scenarioIndex + 1);
}

byId("scenario-choices").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || scenarioAnswered) return;
  scenarioAnswered = true;
  const correct = button.dataset.action === "report";
  if (correct) scenarioScore += 1;
  byId("scenario-choices").querySelectorAll("button").forEach((choice) => { choice.disabled = true; });
  const prefix = button.dataset.action === "delete"
    ? "Deleting avoids the message, but reporting it first can help protect others. "
    : button.dataset.action === "click"
      ? "Don't follow a suspicious link or act on its request. "
      : "";
  showFeedback(byId("scenario-feedback"), correct, prefix + scenarios[scenarioIndex].explanation);
  updateProgress("scenario", scenarioIndex + 1, scenarios.length, scenarioIndex + 1);
  scenariosCompleted = Math.max(scenariosCompleted, scenarioIndex + 1);
  updateTrainingProgress();
  byId("scenario-next").innerHTML = scenarioIndex === scenarios.length - 1 ? "See results <span aria-hidden=\"true\">→</span>" : "Next scenario <span aria-hidden=\"true\">→</span>";
  byId("scenario-next").hidden = false;
});

byId("scenario-next").addEventListener("click", () => {
  if (!scenarioAnswered) return;
  scenarioIndex += 1;
  if (scenarioIndex < scenarios.length) {
    renderScenario();
    byId("scenario-heading").focus();
  } else {
    byId("scenario-content").hidden = true;
    byId("scenario-complete").hidden = false;
    byId("scenario-result").textContent = `You chose the best response in ${scenarioScore} out of ${scenarios.length} scenarios. Remember: report suspicious messages before deleting them.`;
    byId("scenario-restart").focus();
  }
});

byId("scenario-restart").addEventListener("click", () => {
  scenarioIndex = 0;
  scenarioScore = 0;
  renderScenario();
  byId("scenario-heading").focus();
});

function renderQuiz() {
  const question = quizQuestions[quizIndex];
  quizAnswered = false;
  byId("quiz-content").hidden = false;
  byId("quiz-complete").hidden = true;
  byId("quiz-question").textContent = question.question;
  byId("quiz-feedback").hidden = true;
  byId("quiz-next").hidden = true;
  const options = byId("quiz-options");
  options.replaceChildren();
  question.options.forEach((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.dataset.index = index;
    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = String.fromCharCode(65 + index);
    const label = document.createElement("span");
    label.textContent = text;
    button.append(letter, label);
    options.append(button);
  });
  updateProgress("quiz", quizIndex, quizQuestions.length, quizIndex + 1);
}

byId("quiz-options").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-index]");
  if (!button || quizAnswered) return;
  quizAnswered = true;
  const question = quizQuestions[quizIndex];
  const correct = Number(button.dataset.index) === question.answer;
  if (correct) quizScore += 1;
  byId("quiz-options").querySelectorAll("button").forEach((option) => {
    option.disabled = true;
    if (Number(option.dataset.index) === question.answer) option.classList.add("selected-correct");
  });
  if (!correct) button.classList.add("selected-incorrect");
  const explanation = correct ? question.explanation : `Correct answer: ${question.options[question.answer]}. ${question.explanation}`;
  showFeedback(byId("quiz-feedback"), correct, explanation);
  updateProgress("quiz", quizIndex + 1, quizQuestions.length, quizIndex + 1);
  questionsCompleted = Math.max(questionsCompleted, quizIndex + 1);
  updateTrainingProgress();
  byId("quiz-next").innerHTML = quizIndex === quizQuestions.length - 1 ? "See my score <span aria-hidden=\"true\">→</span>" : "Next question <span aria-hidden=\"true\">→</span>";
  byId("quiz-next").hidden = false;
});

byId("quiz-next").addEventListener("click", () => {
  if (!quizAnswered) return;
  quizIndex += 1;
  if (quizIndex < quizQuestions.length) {
    renderQuiz();
    byId("quiz-question").focus();
  } else {
    byId("quiz-content").hidden = true;
    byId("quiz-complete").hidden = false;
    byId("quiz-result").textContent = `You scored ${quizScore} out of ${quizQuestions.length} (${Math.round(quizScore / quizQuestions.length * 100)}%). Keep practicing and remember to pause before you click.`;
    byId("quiz-restart").focus();
  }
});

byId("quiz-restart").addEventListener("click", () => {
  quizIndex = 0;
  quizScore = 0;
  renderQuiz();
  byId("quiz-question").focus();
});

byId("certificate-name").addEventListener("input", (event) => {
  byId("certificate-recipient").textContent = event.target.value.trim() || "Your name";
});
byId("certificate-print").addEventListener("click", () => window.print());

byId("scenario-heading").tabIndex = -1;
byId("quiz-question").tabIndex = -1;
renderScenario();
renderQuiz();
updateTrainingProgress();
