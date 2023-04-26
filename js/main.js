class GetDataFromApi {
  constructor(newURL) {
    (this.url = newURL), (this.data = null);
  }
  async getData() {
    if (null === this.data) {
      const response = await fetch(this.url);
      this.data = await response.json();
    }
    return this.data;
  }
}
class Header {
  constructor(placeToRenderHeader, logoSrc) {
    (this.placeToRenderHeader = document.querySelector(placeToRenderHeader)),
      (this.logoSrc = logoSrc),
      (this.header = document.createElement("header")),
      (this.header.className = "header"),
      (this.logo = document.createElement("img")),
      (this.logo.className = "header__logo"),
      (this.logo.src = this.logoSrc),
      (this.logo.alt = "Doesburg Coaching Logo");
  }
  render() {
    this.header.appendChild(this.logo),
      this.placeToRenderHeader.appendChild(this.header);
  }
}
class Main {
  constructor() {
    (this.main = document.createElement("main")),
      (this.main.className = "main"),
      document.body.appendChild(this.main);
  }
}
class Title {
  constructor(placeToRenderTitle, titleText) {
    (this.placeToRenderTitle = document.querySelector(placeToRenderTitle)),
      (this.titleText = titleText),
      (this.titleContainer = document.createElement("div")),
      (this.titleContainer.className = "title"),
      (this.title = document.createElement("h1")),
      (this.title.className = "title__text"),
      (this.title.textContent = this.titleText);
  }
  render() {
    this.titleContainer.appendChild(this.title),
      this.placeToRenderTitle.appendChild(this.titleContainer);
  }
}
class Explanation {
  constructor(placeToRenderExplanation, paragraphs) {
    (this.placeToRenderExplanation = document.querySelector(
      placeToRenderExplanation
    )),
      (this.paragraphs = paragraphs),
      (this.explanationContainer = document.createElement("div")),
      (this.explanationContainer.className = "explanation"),
      (this.paragraphElements = paragraphs.map((paragraph) => {
        const p = document.createElement("p");
        return (
          (p.className = paragraph.className),
          (p.textContent = paragraph.text),
          p
        );
      }));
  }
  render() {
    this.paragraphElements.forEach((p) =>
      this.explanationContainer.appendChild(p)
    ),
      this.placeToRenderExplanation.appendChild(this.explanationContainer);
  }
}
class Slider {
  constructor(placeToRenderSlider, sections) {
    (this.placeToRenderSlider = document.querySelector(placeToRenderSlider)),
      (this.sections = sections);
  }
  createSliderOption(sliderOptions) {
    const sliderOption = document.createElement("label");
    sliderOption.className = "slider__option slider__option--explain";
    const input = document.createElement("input");
    (input.type = "radio"),
      (input.name = sliderOptions.name),
      (input.value = sliderOptions.value),
      (input.disabled = sliderOptions.disabled),
      sliderOptions.checked && (input.checked = !0),
      sliderOption.appendChild(input);
    const label = document.createElement("span");
    return (
      (label.className = "slider__option__label"),
      (label.textContent = sliderOptions.value),
      sliderOption.appendChild(label),
      sliderOption
    );
  }
  createSliderTextElement(textValue) {
    const text = document.createElement("p");
    return (
      (text.className = "slider__text"), (text.textContent = textValue), text
    );
  }
  createSliderSection(section) {
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "main__sectionSlider";
    const title = document.createElement("p");
    (title.className = "explanation__text explanation__texttitle"),
      (title.textContent = section.title),
      sectionContainer.appendChild(title);
    const slider = document.createElement("div");
    (slider.className = "slider"),
      section.sliders.forEach((sliderOptions) => {
        const sliderOption = this.createSliderOption(sliderOptions);
        slider.appendChild(sliderOption);
      });
    const textWrapper = document.createElement("div");
    textWrapper.className = "slider__textWrapper";
    return (
      ["Nooit", "Soms", "Altijd"].forEach((textValue) => {
        const text = this.createSliderTextElement(textValue);
        textWrapper.appendChild(text);
      }),
      slider.appendChild(textWrapper),
      sectionContainer.appendChild(slider),
      sectionContainer
    );
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
    (this.parentElement = document.querySelector(parentElement)),
      (this.container = document.createElement("div")),
      (this.container.className = "volgendeStap"),
      (this.label = document.createElement("label")),
      (this.label.htmlFor = "name-input"),
      (this.label.className = "volgendeStap__label"),
      (this.label.textContent = "Vul uw naam in:"),
      (this.input = document.createElement("input")),
      (this.input.type = "text"),
      (this.input.id = "name-input"),
      (this.input.name = "name-input"),
      (this.input.placeholder = "John Doe"),
      (this.input.className = "volgendeStap__nameInput"),
      this.input.addEventListener("input", () => {
        localStorage.setItem("FullName", this.input.value),
          this.checkFullName();
      }),
      (this.button = document.createElement("button")),
      (this.button.type = "submit"),
      (this.button.className =
        "volgendeStap__button volgendeStap__button--disabled"),
      (this.button.textContent = "BEGIN VRAGENLIJST"),
      (this.button.disabled = !0),
      (this.textContainer = document.createElement("p")),
      (this.textContainer.className = "volgendeStap__textContainer"),
      (this.textContainer.textContent = "Totaal 40 vragen"),
      (this.button.onclick = this.startQuiz);
  }
  startQuiz = () => {
    (this.parentElement.innerHTML = ""),
      (this.button = document.createElement("button")),
      (this.button.type = "submit"),
      (this.button.className =
        "volgendeStap__button volgendeStap__button--disabled volgendeStap__button--margin"),
      (this.button.textContent = "Volgende"),
      (this.button.disabled = !0),
      (this.GetDataFromApi = new GetDataFromApi("../data/questions.json")),
      this.GetDataFromApi.getData().then((data) => {
        data.forEach((questionData) => {
          const questionElement = new Questions(questionData).createQuestion();
          this.parentElement.appendChild(questionElement),
            this.parentElement.appendChild(this.button),
            (this.checkIfAnswered = new CheckIfAnswered()),
            (this.button.onclick = this.addExtraPoints);
        });
      });
  };
  addExtraPoints = () => {
    new AddExtraPoints(this.parentElement).init();
  };
  checkFullName() {
    localStorage.getItem("FullName")
      ? ((this.button.disabled = !1),
        (this.button.className =
          "volgendeStap__button volgendeStap__button--enabled"))
      : ((this.button.disabled = !0),
        (this.button.className =
          "volgendeStap__button volgendeStap__button--disabled"));
  }
  render() {
    this.container.appendChild(this.label),
      this.container.appendChild(this.input),
      this.container.appendChild(this.button),
      this.container.appendChild(this.textContainer),
      this.parentElement.appendChild(this.container);
    const fullName = localStorage.getItem("FullName");
    fullName && ((this.input.value = fullName), this.checkFullName());
  }
}
class Questions {
  constructor(questionData) {
    (this.questionNumber = questionData.questionNumber),
      (this.questionText = questionData.questionText);
  }
  createQuestion() {
    const centerDiv = document.createElement("div");
    centerDiv.className = "main--centerDiv";
    const explanationText = document.createElement("p");
    (explanationText.className = "explanation__text"),
      (explanationText.innerText =
        this.questionNumber + ". " + this.questionText),
      centerDiv.appendChild(explanationText);
    const slider = this.createSlider();
    return centerDiv.appendChild(slider), centerDiv;
  }
  createSlider() {
    const slider = document.createElement("div");
    slider.className = "slider";
    const sliderTextWrapper = document.createElement("div");
    sliderTextWrapper.className = "slider__textWrapper";
    ["Nooit", "Soms", "Altijd"].forEach((text) => {
      const sliderText = document.createElement("p");
      (sliderText.className = "slider__text"),
        (sliderText.textContent = text),
        sliderTextWrapper.appendChild(sliderText);
    });
    for (let i = 1; i <= 6; i++) {
      const option = document.createElement("label");
      option.className = "slider__option";
      const radio = document.createElement("input");
      (radio.type = "radio"),
        (radio.name = this.questionNumber),
        (radio.value = i);
      const label = document.createElement("span");
      (label.className = "slider__option__label"),
        (label.textContent = i),
        option.appendChild(radio),
        option.appendChild(label),
        slider.appendChild(option);
    }
    return slider.appendChild(sliderTextWrapper), slider;
  }
}
class CheckIfAnswered {
  constructor() {
    (this.button = document.querySelector(".volgendeStap__button")),
      (this.questions = document.querySelectorAll(".slider")),
      this.init();
  }
  init() {
    this.questions.forEach((question) => {
      question.querySelectorAll("input[type=radio]").forEach((input) => {
        input.addEventListener("change", () => {
          this.storeAnswer(input), this.updateButtonState();
        });
      });
    });
  }
  storeAnswer(input) {
    const questionNumber = input.name,
      questionAnswer = input.value;
    localStorage.setItem(questionNumber, questionAnswer);
  }
  updateButtonState() {
    let allAnswered = !0;
    this.questions.forEach((question) => {
      const inputs = question.querySelectorAll("input[type=radio]");
      Array.from(inputs).some((input) => input.checked) || (allAnswered = !1);
    }),
      allAnswered
        ? ((this.button.disabled = !1),
          (this.button.className =
            "volgendeStap__button volgendeStap__button--enabled volgendeStap__button--margin"))
        : ((this.button.disabled = !0),
          (this.button.className =
            "volgendeStap__button volgendeStap__button--disabled volgendeStap__button--margin"));
  }
}
class QuestionSelector {
  constructor(questions) {
    this.questions = questions;
  }
  setQuestions(questions) {
    this.questions = questions;
  }
  selectQuestions(numQuestions) {
    const sortedQuestions = this.questions.sort(
        (a, b) => b.questionAnswer - a.questionAnswer
      ),
      selectedQuestions = [];
    for (const question of sortedQuestions) {
      if (selectedQuestions.length >= numQuestions) break;
      selectedQuestions.push(question);
    }
    return selectedQuestions;
  }
}
class AddExtraPoints {
  constructor(parentElement) {
    this.parentElement = parentElement;
  }
  async init() {
    this.parentElement.innerHTML = "";
    const extraPointsH1 = document.createElement("h1");
    extraPointsH1.classList.add("title__text", "title--extraPoints"),
      (extraPointsH1.innerText =
        "Kijk nu naar je antwoorden en zoek de beweringen die je het hoogst gewaardeerd hebt. Kies hieruit 3 beweringen die het meest op jou van toepassing zijn. Geef deze opvattingen 4 punten extra."),
      document.querySelector(".main").appendChild(extraPointsH1),
      (this.JSONdata = new GetDataFromApi("../data/questions.json")),
      this.JSONdata.getData().then((data) => {
        let sortedQuestions = [];
        data.forEach((question) => {
          (question.questionAnswer = (function getAnswerForQuestion(
            questionNumber
          ) {
            return localStorage.getItem(questionNumber);
          })(question.questionNumber)),
            sortedQuestions.push(question);
        }),
          sortedQuestions.sort((a, b) => b.questionAnswer - a.questionAnswer),
          sortedQuestions.forEach((question) => {
            const centerDiv = document.createElement("div");
            centerDiv.classList.add("main--centerDiv"),
              centerDiv.setAttribute(
                "id",
                `4PointsDiv-${question.questionNumber}`
              );
            const questionParagraph = document.createElement("p");
            questionParagraph.classList.add("explanation__text"),
              questionParagraph.setAttribute(
                "id",
                `4Pointsquestion-${question.questionNumber}`
              ),
              (questionParagraph.textContent = `${question.questionNumber}. ${question.questionText}`);
            const answerParagraph = document.createElement("p");
            answerParagraph.classList.add("explanation__text", "answerClass"),
              answerParagraph.setAttribute(
                "id",
                `4PointsAnswer-${question.questionNumber}`
              ),
              (answerParagraph.textContent = `Uw antwoord: ${question.questionAnswer}`);
            const questionButton = document.createElement("button");
            questionButton.classList.add(
              "volgendeStap__button",
              "volgendeStap__button--enabled",
              "main--marginButton"
            ),
              questionButton.setAttribute(
                "id",
                `4PointsquestionButton-${question.questionNumber}`
              ),
              (questionButton.textContent = "Voeg 4 extra punten toe"),
              centerDiv.appendChild(questionParagraph),
              centerDiv.appendChild(answerParagraph),
              centerDiv.appendChild(questionButton),
              document.querySelector(".main").appendChild(centerDiv);
            const buttons = document.querySelectorAll(".volgendeStap__button");
            let activeCount = 0;
            buttons.forEach((button) => {
              button.onclick = () => {
                button.classList.contains("active")
                  ? (activeCount--,
                    button.classList.remove("active"),
                    button.classList.remove("volgendeStap__button--enabled"),
                    button.classList.add("volgendeStap__button--disabled"))
                  : activeCount < 3 &&
                    (activeCount++,
                    button.classList.add("active"),
                    button.classList.add("volgendeStap__button--enabled"),
                    button.classList.remove("volgendeStap__button--disabled")),
                  3 === activeCount
                    ? ((handInButton.disabled = !1),
                      handInButton.classList.remove(
                        "volgendeStap__button--disabled"
                      ),
                      handInButton.classList.add(
                        "volgendeStap__button--enabled"
                      ))
                    : ((handInButton.disabled = !0),
                      handInButton.classList.remove(
                        "volgendeStap__button--enabled"
                      ),
                      handInButton.classList.add(
                        "volgendeStap__button--disabled"
                      )),
                  3 === activeCount
                    ? buttons.forEach((button) => {
                        button.classList.contains("active")
                          ? ((button.disabled = !1),
                            button.classList.add(
                              "volgendeStap__button--enabled"
                            ),
                            button.classList.remove(
                              "volgendeStap__button--disabled"
                            ))
                          : ((button.disabled = !0),
                            button.classList.add(
                              "volgendeStap__button--disabled"
                            ),
                            button.classList.remove(
                              "volgendeStap__button--enabled"
                            ));
                      })
                    : buttons.forEach((button) => {
                        (button.disabled = !1),
                          button.classList.remove(
                            "volgendeStap__button--disabled"
                          ),
                          button.classList.add("volgendeStap__button--enabled");
                      });
              };
            }),
              questionButton.addEventListener("click", function () {
                const div = this.parentElement,
                  p = div.querySelector(".explanation__text"),
                  answerAmountText = div.querySelector(".answerClass"),
                  button = div.querySelector(".volgendeStap__button");
                div.classList.toggle("main--extraPointsSelected"),
                  p.classList.toggle("main--extraPointsSelectedText"),
                  answerAmountText.classList.toggle(
                    "main--extraPointsSelectedText"
                  ),
                  button.classList.toggle("main--extraPointsSelectedButton"),
                  "Voeg 4 extra punten toe" === button.textContent
                    ? ((button.textContent = "Haal de 4 extra punten weg"),
                      localStorage.setItem(
                        `${question.questionNumber}`,
                        parseInt(`${question.questionAnswer}`) + 4
                      ),
                      (answerAmountText.innerText = `Uw antwoord: ${
                        parseInt(question.questionAnswer) + 4
                      }`))
                    : ((button.textContent = "Voeg 4 extra punten toe"),
                      localStorage.setItem(
                        `${question.questionNumber}`,
                        parseInt(`${question.questionAnswer}`)
                      ),
                      (answerAmountText.innerText = `Uw antwoord: ${parseInt(
                        question.questionAnswer
                      )}`));
              });
          });
        const handInButton = document.createElement("button");
        (handInButton.type = "submit"),
          handInButton.classList.add(
            "volgendeStap__button",
            "volgendeStap__button--disabled",
            "volgendeStap__button--margin"
          ),
          (handInButton.disabled = !0),
          (handInButton.textContent = "Volgende"),
          handInButton.addEventListener("click", () => {
            new HandQuizIn(this.parentElement).handQuizIn();
          }),
          this.parentElement.appendChild(handInButton);
      });
  }
}
class HandQuizIn {
  constructor(parentElement) {
    this.parentElement = parentElement;
  }
  async handQuizIn() {
    this.parentElement.innerHTML = "";
    const mainElement = document.getElementsByClassName("main")[0],
      fullName = document.createElement("h2");
    (fullName.innerText = localStorage.getItem("FullName")),
      fullName.classList.add("title__text"),
      mainElement.appendChild(fullName);
    const div = document.createElement("div"),
      canvas = document.createElement("canvas");
    canvas.setAttribute("id", "radar-chart"),
      div.appendChild(canvas),
      mainElement.appendChild(div);
    var TF = 0,
      AM = 0,
      AU = 0,
      ZE = 0,
      OC = 0,
      DV = 0,
      UI = 0,
      LS = 0;
    for (var key in localStorage)
      if (localStorage.hasOwnProperty(key)) {
        var value = localStorage[key];
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          var num = parseFloat(value);
          (1 != key && 9 != key && 17 != key && 25 != key && 33 != key) ||
            (TF += num),
            (2 != key && 10 != key && 18 != key && 26 != key && 34 != key) ||
              (AM += num),
            (3 != key && 11 != key && 19 != key && 27 != key && 35 != key) ||
              (AU += num),
            (4 != key && 12 != key && 20 != key && 28 != key && 36 != key) ||
              (ZE += num),
            (5 != key && 13 != key && 21 != key && 29 != key && 37 != key) ||
              (OC += num),
            (6 != key && 14 != key && 22 != key && 30 != key && 38 != key) ||
              (DV += num),
            (7 != key && 15 != key && 23 != key && 31 != key && 39 != key) ||
              (UI += num),
            (8 != key && 16 != key && 24 != key && 32 != key && 40 != key) ||
              (LS += num);
        }
      }
    (TF /= 5),
      (AM /= 5),
      (AU /= 5),
      (ZE /= 5),
      (OC /= 5),
      (DV /= 5),
      (UI /= 5),
      (LS /= 5),
      localStorage.setItem("TF", TF),
      localStorage.setItem("AM", AM),
      localStorage.setItem("AU", AU),
      localStorage.setItem("ZE", ZE),
      localStorage.setItem("OC", OC),
      localStorage.setItem("DV", DV),
      localStorage.setItem("UI", UI),
      localStorage.setItem("LS", LS);
    for (
      var attributen = ["TF", "AM", "AU", "ZE", "OC", "DV", "UI", "LS"],
        scores = [],
        i = 0;
      i < attributen.length;
      i++
    ) {
      var score = parseFloat(localStorage.getItem(attributen[i]));
      scores.push(score);
    }
    var config = {
        type: "radar",
        data: {
          labels: attributen,
          datasets: [
            {
              label: "Scores",
              data: scores,
              backgroundColor: "rgba(25, 174, 170, 0.2)",
              borderColor: "rgba(25, 174, 170, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          scale: { ticks: { beginAtZero: !0, min: 0, max: 10, stepSize: 2 } },
          legend: { display: !1 },
          title: { display: !0, text: "Scores per Attribuut" },
        },
      },
      ctx = document.getElementById("radar-chart").getContext("2d");
    new Chart(ctx, config);
    const intro = document.createElement("h2");
    (intro.innerText = "Beschrijving van de loopbaanankers"),
      intro.classList.add("title__text"),
      mainElement.appendChild(intro);
    const introInfo = document.createElement("p");
    (introInfo.innerText =
      "Een korte beschrijving van de ankers staat hieronder vermeld. Lees de beschrijving van de ankers die het meest op jou van toepassing zijn en kijk welke daarvan voor jou herkenbaar zijn."),
      introInfo.classList.add("explanation__text"),
      mainElement.appendChild(introInfo);
    const ankersApi = new GetDataFromApi("/data/loopbaanankers.json"),
      ankersData = await ankersApi.getData();
    ankersData.sort((a, b) => b.score - a.score),
      ankersData.forEach((ankerData) => {
        const title = document.createElement("h2");
        (title.innerText =
          ankerData.title +
          " - Score: " +
          localStorage.getItem(ankerData.score)),
          title.classList.add("title__text"),
          mainElement.appendChild(title);
        const description = document.createElement("p");
        (description.innerText = ankerData.description),
          description.classList.add("explanation__text"),
          mainElement.appendChild(description);
      });
    const resultsNextButton = document.createElement("button");
    (resultsNextButton.type = "submit"),
      resultsNextButton.classList.add(
        "volgendeStap__button",
        "volgendeStap__button--enabled",
        "volgendeStap__button--margin"
      ),
      (resultsNextButton.disabled = !1),
      (resultsNextButton.textContent = "Download Resultaten"),
      resultsNextButton.addEventListener("click", () => {
        new AfterResults(this.parentElement).afterResults();
      }),
      this.parentElement.appendChild(resultsNextButton);
  }
}
class AfterResults {
  constructor(parentElement) {
    this.parentElement = parentElement;
  }
  afterResults() {
    document.querySelector(".volgendeStap__button").remove(),
      window.scrollTo(0, 0),
      html2canvas(document.body).then(function (canvas) {
        const imageData = canvas.toDataURL("image/jpeg"),
          fullName = localStorage.getItem("FullName"),
          downloadLink = document.createElement("a");
        (downloadLink.href = imageData),
          (downloadLink.download = `${fullName} Loopbaan Anker Resultaten.jpeg`),
          downloadLink.click();
      });
    new ThankYou(this.parentElement).thankYou();
  }
}
class ThankYou {
  constructor(parentElement) {
    this.parentElement = parentElement;
  }
  thankYou() {
    const mainElement = document.getElementsByClassName("main")[0];
    this.parentElement.innerHTML = "";
    const container = document.createElement("div");
    container.classList.add("container");
    const title = document.createElement("div");
    title.classList.add("title");
    const titleText = document.createElement("h1");
    titleText.classList.add("title__text"),
      (titleText.textContent = "Bedankt!"),
      title.appendChild(titleText);
    const explanation = document.createElement("div");
    explanation.classList.add("explanation");
    const explanationText1 = document.createElement("p");
    explanationText1.classList.add("explanation__text"),
      (explanationText1.innerHTML =
        "Er is zojuist een screenshot gedownload naar uw computer. Om deze screenshot naar de coach te sturen, kunt u deze als bijlage toevoegen aan een e-mail en deze verzenden naar <a href='mailto:info@doesburgcoaching.nl'>info@doesburgcoaching.nl</a>.");
    const explanationText2 = document.createElement("p");
    explanationText2.classList.add("explanation__text"),
      (explanationText2.textContent = "U kunt de pagina nu afsluiten."),
      explanation.appendChild(explanationText1),
      explanation.appendChild(explanationText2),
      container.appendChild(title),
      container.appendChild(explanation),
      mainElement.appendChild(container);
  }
}
class Footer {
  constructor(parentElement) {
    (this.parentElement = document.querySelector(parentElement)),
      (this.footer = document.createElement("footer")),
      (this.footer.className = "footer"),
      (this.itemsList = document.createElement("ul")),
      (this.itemsList.className = "footer__items"),
      (this.item1 = document.createElement("li")),
      (this.item1.className = "footer__item"),
      (this.link1 = document.createElement("a")),
      (this.link1.href = "https://doesburgcoaching.nl/privacyverklaring/"),
      (this.link1.target = "_blank"),
      (this.link1.className = "footer__hyperlink"),
      (this.link1.textContent = "Privacyverklaring"),
      (this.itemSeparator = document.createElement("li")),
      (this.itemSeparator.className = "footer__item"),
      (this.itemSeparator.textContent = "|"),
      (this.item2 = document.createElement("li")),
      (this.item2.className = "footer__item"),
      (this.link2 = document.createElement("a")),
      (this.link2.href = "https://doesburgcoaching.nl/colofon/"),
      (this.link2.target = "_blank"),
      (this.link2.className = "footer__hyperlink"),
      (this.link2.textContent = "Colofon");
  }
  render() {
    this.item1.appendChild(this.link1),
      this.item2.appendChild(this.link2),
      this.itemsList.appendChild(this.item1),
      this.itemsList.appendChild(this.itemSeparator),
      this.itemsList.appendChild(this.item2),
      this.footer.appendChild(this.itemsList),
      this.parentElement.appendChild(this.footer);
  }
}
class ExplanationParagraphs {
  constructor() {
    this.paragraphs = this.init();
  }
  async init() {
    const response = await fetch("/data/explanationParagraphs.json");
    return await response.json();
  }
  get() {
    return this.paragraphs;
  }
}
class SliderSections {
  constructor() {
    this.sections = this.init();
  }
  async init() {
    const response = await fetch("/data/sliderSections.json");
    return await response.json();
  }
  get() {
    return this.sections;
  }
}
class App {
  constructor() {
    this.init();
  }
  async init() {
    (this.header = new Header("body", "/assets/img/site-logo-2.png")),
      this.header.render(),
      (this.main = new Main()),
      (this.title = new Title(".main", "Vragenlijst Loopbaanankers (Schein)")),
      this.title.render();
    const explanationParagraphs = new ExplanationParagraphs(),
      paragraphsData = await explanationParagraphs.get();
    (this.explanation = new Explanation(".main", paragraphsData)),
      this.explanation.render();
    const sliderSections = new SliderSections(),
      sectionsData = await sliderSections.get();
    (this.slider = new Slider(".main", sectionsData)),
      this.slider.render(),
      (this.volgendeStap = new VolgendeStap(".main")),
      this.volgendeStap.render(),
      (this.footer = new Footer("body")),
      this.footer.render();
  }
}
const app = new App();
