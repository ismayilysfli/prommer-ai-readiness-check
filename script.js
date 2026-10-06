const readinessItems = [
  {
    key: "problem",
    missing: "Define the business problem and who it affects.",
    action: "Write a one-sentence problem statement with the people and process affected."
  },
  {
    key: "metric",
    missing: "Choose a measurable success metric.",
    action: "Set one measurable target and record its current baseline."
  },
  {
    key: "data",
    missing: "Confirm that the required data is available and usable.",
    action: "Audit the required data for access, quality, privacy, and coverage."
  },
  {
    key: "owner",
    missing: "Assign one person to own the outcome.",
    action: "Name an accountable business owner with authority to make decisions."
  },
  {
    key: "oversight",
    missing: "Design a human review or override step.",
    action: "Define when a person must review, correct, or stop the AI output."
  },
  {
    key: "pilot",
    missing: "Define a safe, small-scale pilot.",
    action: "Choose a limited user group, timeline, and stopping criteria for a pilot."
  }
];

function evaluateReadiness(answers) {
  const score = readinessItems.filter((item) => answers[item.key] === "yes").length;
  const missing = readinessItems.filter((item) => answers[item.key] !== "yes");

  if (score <= 2) {
    return {
      score,
      title: "Not Ready Yet",
      explanation: "The idea needs stronger foundations before time or budget is committed to building it.",
      missing: missing.slice(0, 2).map((item) => item.missing),
      nextStep: missing[0].action
    };
  }

  if (score <= 4) {
    return {
      score,
      title: "Ready for a Small Pilot",
      explanation: "The core idea is promising, but a limited test should resolve the remaining gaps before full implementation.",
      missing: missing.slice(0, 2).map((item) => item.missing),
      nextStep: missing[0]?.action || "Plan a time-boxed pilot with clear success and stopping criteria."
    };
  }

  return {
    score,
    title: "Ready for Implementation Planning",
    explanation: "The essential business, ownership, data, oversight, and testing foundations are in place.",
    missing: missing.slice(0, 2).map((item) => item.missing),
    nextStep: missing[0]?.action || "Document the implementation plan, owners, safeguards, and launch measures."
  };
}

function initializeApp() {
  const form = document.querySelector("#readiness-form");
  const resultSection = document.querySelector("#result");
  const resultTitle = document.querySelector("#result-title");
  const resultScore = document.querySelector("#result-score");
  const resultExplanation = document.querySelector("#result-explanation");
  const readinessDetailTitle = document.querySelector("#readiness-detail-title");
  const missingItems = document.querySelector("#missing-items");
  const readinessStatus = document.querySelector("#readiness-status");
  const nextStep = document.querySelector("#next-step");
  const retakeButton = document.querySelector("#retake-button");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const answers = Object.fromEntries(formData.entries());
    const result = evaluateReadiness(answers);

    resultScore.textContent = `${result.score} of 6 readiness checks met`;
    resultTitle.textContent = result.title;
    resultExplanation.textContent = result.explanation;
    nextStep.textContent = result.nextStep;
    missingItems.replaceChildren();

    result.missing.forEach((text) => {
      const listItem = document.createElement("li");
      listItem.textContent = text;
      missingItems.append(listItem);
    });

    const allFoundationsCovered = result.missing.length === 0;
    readinessDetailTitle.textContent = allFoundationsCovered
      ? "Readiness status"
      : "Most important missing items";
    missingItems.hidden = allFoundationsCovered;
    readinessStatus.hidden = !allFoundationsCovered;

    form.hidden = true;
    resultSection.hidden = false;
    resultTitle.focus({ preventScroll: true });
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  retakeButton.addEventListener("click", () => {
    form.reset();
    resultSection.hidden = true;
    form.hidden = false;
    document.querySelector("input[name='problem']").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (typeof document !== "undefined") {
  initializeApp();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { evaluateReadiness };
}
