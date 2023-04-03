class GetDataFromApi {
  url = "";
  data = null;

  constructor(newURL) {
    this.url = newURL;
  }

  async getData() {
    if (this.data === null) {
      await fetch(this.url)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.data = data;
        });
    }
    return this.data;
  }
}

class Header {
  placeToRenderHeader;
  logoSrc;

  constructor(placeToRenderHeader, logoSrc) {
    this.placeToRenderHeader = document.querySelector(placeToRenderHeader);
    this.logoSrc = logoSrc;

    this.header = document.createElement("header");
    this.header.className = "header";

    this.logo = document.createElement("img");
    this.logo.className = "header__logo";
    this.logo.src = this.logoSrc;
    this.logo.alt = "Doesburg Coaching Logo";
  }

  render() {
    this.header.appendChild(this.logo);
    this.placeToRenderHeader.appendChild(this.header);
  }
}

class Main {
  constructor() {
    this.main = document.createElement("main");
    this.main.className = "main";
    document.body.appendChild(this.main);
  }
}

class Title {
  constructor(placeToRenderTitle, titleText) {
    this.placeToRenderTitle = document.querySelector(placeToRenderTitle);
    this.titleText = titleText;

    this.titleContainer = document.createElement("div");
    this.titleContainer.className = "title";

    this.title = document.createElement("h1");
    this.title.className = "title__text";
    this.title.textContent = this.titleText;
  }

  render() {
    this.titleContainer.appendChild(this.title);
    this.placeToRenderTitle.appendChild(this.titleContainer);
  }
}

class Explanation {
  constructor(placeToRenderExplanation, paragraphs) {
    this.placeToRenderExplanation = document.querySelector(
      placeToRenderExplanation
    );
    this.paragraphs = paragraphs;

    this.explanationContainer = document.createElement("div");
    this.explanationContainer.className = "explanation";

    this.paragraphElements = paragraphs.map((paragraph) => {
      const p = document.createElement("p");
      p.className = paragraph.className;
      p.textContent = paragraph.text;
      return p;
    });
  }

  render() {
    this.paragraphElements.forEach((p) =>
      this.explanationContainer.appendChild(p)
    );
    this.placeToRenderExplanation.appendChild(this.explanationContainer);
  }
}

class Slider {
  constructor(placeToRenderSlider, sections) {
    this.placeToRenderSlider = document.querySelector(placeToRenderSlider);
    this.sections = sections;
  }

  createSliderSection(section) {
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "main__sectionSlider";

    const title = document.createElement("p");
    title.className = "explanation__text explanation__texttitle";
    title.textContent = section.title;
    sectionContainer.appendChild(title);

    const slider = document.createElement("div");
    slider.className = "slider";

    section.sliders.forEach((sliderOptions) => {
      const sliderOption = document.createElement("label");
      sliderOption.className = "slider__option slider__option--explain";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = sliderOptions.name;
      input.value = sliderOptions.value;
      input.disabled = sliderOptions.disabled;
      if (sliderOptions.checked) input.checked = true;
      sliderOption.appendChild(input);

      const label = document.createElement("span");
      label.className = "slider__option__label";
      label.textContent = sliderOptions.value;
      sliderOption.appendChild(label);

      slider.appendChild(sliderOption);
    });

    const textWrapper = document.createElement("div");
    textWrapper.className = "slider__textWrapper";

    const textValues = ["Nooit", "Soms", "Altijd"];
    textValues.forEach((textValue) => {
      const text = document.createElement("p");
      text.className = "slider__text";
      text.textContent = textValue;
      textWrapper.appendChild(text);
    });

    slider.appendChild(textWrapper);
    sectionContainer.appendChild(slider);
    return sectionContainer;
  }

  render() {
    this.sections.forEach((section) => {
      const sectionElement = this.createSliderSection(section);
      this.placeToRenderSlider.appendChild(sectionElement);
    });
  }
}

class VolgendeStap {
  constructor(parentElement) {
    this.parentElement = document.querySelector(parentElement);

    this.container = document.createElement("div");
    this.container.className = "volgendeStap";

    this.label = document.createElement("label");
    this.label.htmlFor = "name-input";
    this.label.className = "volgendeStap__label";
    this.label.textContent = "Vul uw naam in:";

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.id = "name-input";
    this.input.name = "name-input";
    this.input.placeholder = "John Doe";
    this.input.className = "volgendeStap__nameInput";

    this.input.addEventListener("input", () => {
      localStorage.setItem("FullName", this.input.value);
      this.checkFullName();
    });

    this.button = document.createElement("button");
    this.button.type = "submit";
    this.button.className =
      "volgendeStap__button volgendeStap__button--disabled";
    this.button.textContent = "BEGIN VRAGENLIJST";
    this.button.disabled = true; // Set disabled initially

    this.textContainer = document.createElement("p");
    this.textContainer.className = "volgendeStap__textContainer";
    this.textContainer.textContent = "Totaal 40 vragen";

    this.button.onclick = this.startQuiz;
  }

  startQuiz = () => {
    this.parentElement.innerHTML = "";
    this.button = document.createElement("button");
    this.button.type = "submit";
    this.button.className =
      "volgendeStap__button volgendeStap__button--disabled volgendeStap__button--margin";
    this.button.textContent = "Volgende";
    this.button.disabled = true;
    this.GetDataFromApi = new GetDataFromApi("../data/questions.json");
    this.GetDataFromApi.getData().then((data) => {
      data.forEach((questionData) => {
        const question = new Questions(questionData);
        const questionElement = question.createQuestion();
        this.parentElement.appendChild(questionElement);
        this.parentElement.appendChild(this.button);
        this.checkIfAnswered = new CheckIfAnswered();
        this.button.onclick = this.addExtraPoints;
      });
    });
  };

  addExtraPoints = () => {
    this.parentElement.innerHTML = "";
    const extraPointsH1 = document.createElement("h1"); // create h1 element
    extraPointsH1.classList.add("title__text", "title--extraPoints"); // add class
    extraPointsH1.innerText =
      "Kijk nu naar je antwoorden en zoek de beweringen die je het hoogst gewaardeerd hebt. Kies hieruit 3 beweringen die het meest op jou van toepassing zijn. Geef deze opvattingen 4 punten extra.";
    document.querySelector(".main").appendChild(extraPointsH1);

    // Define a function to get the answer for a question from local storage
    function getAnswerForQuestion(questionNumber) {
      return localStorage.getItem(questionNumber);
    }

    this.JSONdata = new GetDataFromApi("../data/questions.json");
    this.JSONdata.getData().then((data) => {
      // Create an array to store the sorted questions
      let sortedQuestions = [];

      // Loop through each question and add the answer from local storage to it
      data.forEach((question) => {
        question.questionAnswer = getAnswerForQuestion(question.questionNumber);
        sortedQuestions.push(question);
      });

      // Sort the questions based on their 'questionAnswer' property in descending order
      sortedQuestions.sort((a, b) => b.questionAnswer - a.questionAnswer);

      sortedQuestions.forEach((question) => {
        // create div element with class and id
        const centerDiv = document.createElement("div");
        centerDiv.classList.add("main--centerDiv");
        centerDiv.setAttribute("id", `4PointsDiv-${question.questionNumber}`);

        // create paragraph element with class and id
        const questionParagraph = document.createElement("p");
        questionParagraph.classList.add("explanation__text");
        questionParagraph.setAttribute(
          "id",
          `4Pointsquestion-${question.questionNumber}`
        );
        questionParagraph.textContent = `${question.questionText}`;

        // create paragraph element with class and id
        const answerParagraph = document.createElement("p");
        answerParagraph.classList.add("explanation__text", "answerClass");
        answerParagraph.setAttribute(
          "id",
          `4PointsAnswer-${question.questionNumber}`
        );
        answerParagraph.textContent = `Uw antwoord: ${question.questionAnswer}`;

        // create button element with class and id
        const questionButton = document.createElement("button");
        questionButton.classList.add(
          "volgendeStap__button",
          "volgendeStap__button--enabled",
          "main--marginButton"
        );
        questionButton.setAttribute(
          "id",
          `4PointsquestionButton-${question.questionNumber}`
        );
        questionButton.textContent = "Voeg 4 extra punten toe";

        // append paragraph and button to div element
        centerDiv.appendChild(questionParagraph);
        centerDiv.appendChild(answerParagraph);
        centerDiv.appendChild(questionButton);

        // append centerDiv to an existing element with class 'main'
        document.querySelector(".main").appendChild(centerDiv);

        // add event listener to the button
        questionButton.addEventListener("click", function () {
          const div = this.parentElement;
          const p = div.querySelector(".explanation__text");
          const answerAmountText = div.querySelector(".answerClass");
          const button = div.querySelector(".volgendeStap__button");

          div.classList.toggle("main--extraPointsSelected");
          p.classList.toggle("main--extraPointsSelectedText");
          answerAmountText.classList.toggle("main--extraPointsSelectedText");
          button.classList.toggle("main--extraPointsSelectedButton");

          // toggle button inner text
          if (button.textContent === "Voeg 4 extra punten toe") {
            button.textContent = "Haal de 4 extra punten weg";
            localStorage.setItem(
              `${question.questionNumber}`,
              parseInt(`${question.questionAnswer}`) + 4
            );
            answerAmountText.innerText = `Uw antwoord: ${
              parseInt(question.questionAnswer) + 4
            }`;
          } else {
            button.textContent = "Voeg 4 extra punten toe";
            localStorage.setItem(
              `${question.questionNumber}`,
              parseInt(`${question.questionAnswer}`)
            );
            answerAmountText.innerText = `Uw antwoord: ${parseInt(
              question.questionAnswer
            )}`;
          }
        });
      });
    });
  };

  checkFullName() {
    const fullName = localStorage.getItem("FullName");
    if (fullName) {
      this.button.disabled = false;
      this.button.className =
        "volgendeStap__button volgendeStap__button--enabled";
    } else {
      this.button.disabled = true;
      this.button.className =
        "volgendeStap__button volgendeStap__button--disabled";
    }
  }

  render() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.input);
    this.container.appendChild(this.button);
    this.container.appendChild(this.textContainer);

    this.parentElement.appendChild(this.container);

    const fullName = localStorage.getItem("FullName");
    if (fullName) {
      this.input.value = fullName;
      this.checkFullName();
    }
  }
}

class Questions {
  constructor(questionData) {
    this.questionNumber = questionData.questionNumber;
    this.questionText = questionData.questionText;
  }

  createQuestion() {
    const centerDiv = document.createElement("div");
    centerDiv.className = "main--centerDiv";

    const explanationText = document.createElement("p");
    explanationText.className = "explanation__text";
    explanationText.innerText = this.questionText;
    centerDiv.appendChild(explanationText);

    const slider = this.createSlider();
    centerDiv.appendChild(slider);

    return centerDiv;
  }

  createSlider() {
    const slider = document.createElement("div");
    slider.className = "slider";

    const sliderTextWrapper = document.createElement("div");
    sliderTextWrapper.className = "slider__textWrapper";

    const sliderTextArray = ["Nooit", "Soms", "Altijd"];
    sliderTextArray.forEach((text) => {
      const sliderText = document.createElement("p");
      sliderText.className = "slider__text";
      sliderText.textContent = text;
      sliderTextWrapper.appendChild(sliderText);
    });

    for (let i = 1; i <= 6; i++) {
      const option = document.createElement("label");
      option.className = "slider__option";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = this.questionNumber;
      radio.value = i;

      const label = document.createElement("span");
      label.className = "slider__option__label";
      label.textContent = i;

      option.appendChild(radio);
      option.appendChild(label);

      slider.appendChild(option);
    }

    slider.appendChild(sliderTextWrapper);

    return slider;
  }
}

class CheckIfAnswered {
  constructor() {
    this.button = document.querySelector(".volgendeStap__button");
    this.questions = document.querySelectorAll(".slider");
    this.init();
  }

  init() {
    this.questions.forEach((question) => {
      const inputs = question.querySelectorAll("input[type=radio]");
      inputs.forEach((input) => {
        input.addEventListener("change", () => {
          this.storeAnswer(input);
          this.updateButtonState();
        });
      });
    });
  }

  storeAnswer(input) {
    const questionNumber = input.name;
    const questionAnswer = input.value;
    localStorage.setItem(questionNumber, questionAnswer);
  }

  updateButtonState() {
    let allAnswered = true;

    this.questions.forEach((question) => {
      const inputs = question.querySelectorAll("input[type=radio]");
      const isChecked = Array.from(inputs).some((input) => input.checked);

      if (!isChecked) {
        allAnswered = false;
      }
    });

    if (allAnswered) {
      this.button.disabled = false;
      this.button.className =
        "volgendeStap__button volgendeStap__button--enabled volgendeStap__button--margin";
    } else {
      this.button.disabled = true;
      this.button.className =
        "volgendeStap__button volgendeStap__button--disabled volgendeStap__button--margin";
    }
  }
}

class QuestionSelector {
  constructor(questions) {
    this.questions = questions;
    this.selectedQuestions = [];
  }

  loadQuestions(questions) {
    this.questions = questions;
  }

  addExtraPoints() {
    const sortedQuestions = this.questions.sort(
      (a, b) => b.questionAnswer - a.questionAnswer
    );
    const selectedQuestions = [];
    let highestScore = null;

    for (const question of sortedQuestions) {
      const currentScore = question.questionAnswer;

      if (highestScore === null) {
        highestScore = currentScore;
      }

      if (currentScore < highestScore && selectedQuestions.length >= 10) {
        break;
      }

      selectedQuestions.push(question);
    }

    this.selectedQuestions = selectedQuestions;
    return this.selectedQuestions;
  }
}

class Footer {
  constructor(parentElement) {
    this.parentElement = document.querySelector(parentElement);

    this.footer = document.createElement("footer");
    this.footer.className = "footer";

    this.itemsList = document.createElement("ul");
    this.itemsList.className = "footer__items";

    this.item1 = document.createElement("li");
    this.item1.className = "footer__item";
    this.link1 = document.createElement("a");
    this.link1.href = "https://doesburgcoaching.nl/privacyverklaring/";
    this.link1.target = "_blank";
    this.link1.className = "footer__hyperlink";
    this.link1.textContent = "Privacyverklaring";

    this.itemSeparator = document.createElement("li");
    this.itemSeparator.className = "footer__item";
    this.itemSeparator.textContent = "|";

    this.item2 = document.createElement("li");
    this.item2.className = "footer__item";
    this.link2 = document.createElement("a");
    this.link2.href = "https://doesburgcoaching.nl/colofon/";
    this.link2.target = "_blank";
    this.link2.className = "footer__hyperlink";
    this.link2.textContent = "Colofon";
  }

  render() {
    this.item1.appendChild(this.link1);
    this.item2.appendChild(this.link2);

    this.itemsList.appendChild(this.item1);
    this.itemsList.appendChild(this.itemSeparator);
    this.itemsList.appendChild(this.item2);

    this.footer.appendChild(this.itemsList);

    this.parentElement.appendChild(this.footer);
  }
}

class App {
  constructor() {
    // Create the header
    this.header = new Header("body", "/assets/img/site-logo-2.png");
    this.header.render();

    // Create the main element
    this.main = new Main();

    // Create the title
    this.title = new Title(".main", "Vragenlijst Loopbaanankers (Schein)");
    this.title.render();

    // Create the explanation
    const explanationParagraphs = [
      {
        className: "explanation__text",
        text: "De meeste mensen volgen een opleiding, vinden een baan, doen allerlei cursussen en veranderen van baan zonder dat ze systematisch kijken naar hun drijfveren. Hierdoor komt het regelmatig voor dat mensen, ondanks hun opleiding en ervaring, toch niet gelukkig zijn in hun werk.",
      },
      {
        className: "explanation__text",
        text: "Schein noemt deze drijfveren carrièreankers. Carrièreankers zeggen iets over je motivatie, houding, voorkeur en waarden. Ben je bijvoorbeeld meer geïnteresseerd in individuele vrijheid of ga je meer voor macht en status?",
      },
      {
        className: "explanation__text",
        text: "Je loopbaananker is een combinatie van waargenomen competentieterreinen, drijfveren en waarden die je niet wilt opgeven; het staat voor je werkelijke zelf. Zonder kennis van deze ankers, zouden externe prikkels je kunnen brengen in situaties of banen die uiteindelijk niet bevredigend zijn, omdat je voelt dat je 'dit niet werkelijk bent'",
      },
      {
        className: "explanation__text",
        text: "Schein onderscheidt achtcarrièreankers; technisch/functioneel (TF), algemeen management (AM), autonomie/onafhankelijkheid (AU), zekerheid enstabiliteit (ZE), ondernemingsgerichte creativiteit (OC), dienstverlening/toewijding aan de zaak (DV), zuivere uitdaging (UI) en levensstijl (LS).",
      },
      {
        className: "explanation__text explanation__texttitle",
        text: "Loopbaananker test",
      },
      {
        className: "explanation__text",
        text: "Om erachter te komen welke loopbaanankers voor jou leidend zijn, kun je de test op de volgende pagina doen. Aldaarzie je een aantal beweringen (1 tot 40). De beweringenbeschrijven een activiteit, waarde of een eigenschap. Geef per keer aan in hoeverre deze beweringopjouvan toepassing is. Ook als dezeminder of niet op je van toepassingis. Maak dus altijd een keuze.",
      },
      {
        className: "explanation__text",
        text: "Om te ontdekken welke loopbaanankers voor jou van belang zijn, kun je de test op de volgende digitale pagina doen. Op deze pagina vind je een reeks beweringen (1 tot 40) die een activiteit, waarde of eigenschap beschrijven. Geef aan in hoeverre elke bewering op jou van toepassing is, zelfs als deze minder relevant of niet van toepassing is. Zorg er dus voor dat je altijd een keuze maakt.",
      },
      {
        className: "explanation__text explanation__texttitle",
        text: "De punten die je kunt verdelen tref je in onderstaande tabel aan:",
      },
      {
        className: "explanation__text",
        text: "Dus geef elk van de 40 uitspraken een waardering van 1 tot 6. Hoe hoger het getal hoe meer de betreffende uitspraak voor jou opgaat.",
      },
    ];

    this.explanation = new Explanation(".main", explanationParagraphs);
    this.explanation.render();

    // Create the sliders
    const sliderSections = [
      // Is nooit bij mij van toepassing
      {
        title: "Is nooit bij mij van toepassing:",
        sliders: [
          {
            name: "nooitVanToepassing",
            value: "1",
            checked: true,
            disabled: true,
          },
          { name: "nooitVanToepassing", value: "2", disabled: true },
          { name: "nooitVanToepassing", value: "3", disabled: true },
          { name: "nooitVanToepassing", value: "4", disabled: true },
          { name: "nooitVanToepassing", value: "5", disabled: true },
          { name: "nooitVanToepassing", value: "6", disabled: true },
        ],
      },

      // Is vaak bij mij van toepassing:
      {
        title: "Is vaak op mij van toepassing:",
        sliders: [
          { name: "isVaakVanToepassing1", value: "1", disabled: true },
          {
            name: "isVaakVanToepassing1",
            value: "2",
            checked: true,
            disabled: true,
          },
          { name: "isVaakVanToepassing1", value: "3", disabled: true },
          { name: "isVaakVanToepassing1", value: "4", disabled: true },
          { name: "isVaakVanToepassing1", value: "5", disabled: true },
          { name: "isVaakVanToepassing1", value: "6", disabled: true },
        ],
      },

      // Is vaak bij mij van toepassing 2:
      {
        title: "",
        sliders: [
          { name: "isVaakVanToepassing2", value: "1", disabled: true },
          { name: "isVaakVanToepassing2", value: "2", disabled: true },
          {
            name: "isVaakVanToepassing2",
            value: "3",
            checked: true,
            disabled: true,
          },
          { name: "isVaakVanToepassing2", value: "4", disabled: true },
          { name: "isVaakVanToepassing2", value: "5", disabled: true },
          { name: "isVaakVanToepassing2", value: "6", disabled: true },
        ],
      },

      // Is zo nu en dan bij mij van toepassing 1:
      {
        title: "Is zo nu en dan bij mij van toepassing:",
        sliders: [
          { name: "isZoNuEnDanVanToepassing1", value: "1", disabled: true },
          { name: "isZoNuEnDanVanToepassing1", value: "2", disabled: true },
          { name: "isZoNuEnDanVanToepassing1", value: "3", disabled: true },
          {
            name: "isZoNuEnDanVanToepassing1",
            value: "4",
            checked: true,
            disabled: true,
          },

          { name: "isZoNuEnDanVanToepassing1", value: "5", disabled: true },
          { name: "isZoNuEnDanVanToepassing1", value: "6", disabled: true },
        ],
      },

      // Is zo nu en dan bij mij van toepassing 2:
      {
        title: "",
        sliders: [
          { name: "isZoNuEnDanVanToepassing2", value: "1", disabled: true },
          { name: "isZoNuEnDanVanToepassing2", value: "2", disabled: true },
          { name: "isZoNuEnDanVanToepassing2", value: "3", disabled: true },
          { name: "isZoNuEnDanVanToepassing2", value: "4", disabled: true },
          {
            name: "isZoNuEnDanVanToepassing2",
            value: "5",
            checked: true,
            disabled: true,
          },
          { name: "isZoNuEnDanVanToepassing2", value: "6", disabled: true },
        ],
      },

      // Is altijd bij mij van toepassing 2:
      {
        title: "Is altijd bij mij van toepassing:",
        sliders: [
          { name: "altijdVanToepassing", value: "1", disabled: true },
          { name: "altijdVanToepassing", value: "2", disabled: true },
          { name: "altijdVanToepassing", value: "3", disabled: true },
          { name: "altijdVanToepassing", value: "4", disabled: true },
          { name: "altijdVanToepassing", value: "5", disabled: true },
          {
            name: "altijdVanToepassing",
            value: "6",
            checked: true,
            disabled: true,
          },
        ],
      },
    ];

    this.slider = new Slider(".main", sliderSections);
    this.slider.render();

    // Create the "Volgende Stap" element
    this.volgendeStap = new VolgendeStap(".main");
    this.volgendeStap.render();

    // Create the footer
    this.footer = new Footer("body");
    this.footer.render();
  }
}

const app = new App();
