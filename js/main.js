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
    const extraPointsH1 = document.createElement("h1");
    extraPointsH1.classList.add("title__text", "title--extraPoints");
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
        questionParagraph.textContent = `${question.questionNumber}. ${question.questionText}`;

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

        const buttons = document.querySelectorAll(".volgendeStap__button");
        let activeCount = 0;

        buttons.forEach((button) => {
          button.onclick = () => {
            console.log(activeCount);
            if (button.classList.contains("active")) {
              activeCount--;
              button.classList.remove("active");
              button.classList.remove("volgendeStap__button--enabled");
              button.classList.add("volgendeStap__button--disabled");
            } else if (activeCount < 3) {
              activeCount++;
              button.classList.add("active");
              button.classList.add("volgendeStap__button--enabled");
              button.classList.remove("volgendeStap__button--disabled");
            }

            if (activeCount === 3) {
              handInButton.disabled = false;
              handInButton.classList.remove("volgendeStap__button--disabled");
              handInButton.classList.add("volgendeStap__button--enabled");
            } else {
              handInButton.disabled = true;
              handInButton.classList.remove("volgendeStap__button--enabled");
              handInButton.classList.add("volgendeStap__button--disabled");
            }

            if (activeCount === 3) {
              buttons.forEach((button) => {
                if (!button.classList.contains("active")) {
                  button.disabled = true;
                  button.classList.add("volgendeStap__button--disabled");
                  button.classList.remove("volgendeStap__button--enabled");
                } else {
                  button.disabled = false;
                  button.classList.add("volgendeStap__button--enabled");
                  button.classList.remove("volgendeStap__button--disabled");
                }
              });
            } else {
              buttons.forEach((button) => {
                button.disabled = false;
                button.classList.remove("volgendeStap__button--disabled");
                button.classList.add("volgendeStap__button--enabled");
              });
            }
          };
        });

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
      const handInButton = document.createElement("button");
      handInButton.type = "submit";
      handInButton.classList.add(
        "volgendeStap__button",
        "volgendeStap__button--disabled",
        "volgendeStap__button--margin"
      );
      handInButton.disabled = true;
      handInButton.textContent = "Volgende";

      handInButton.addEventListener("click", () => {
        this.handQuizIn();
      });
      this.parentElement.appendChild(handInButton);
    });
  };

  handQuizIn() {
    this.parentElement.innerHTML = "";

    const mainElement = document.getElementsByClassName("main")[0];

    const fullName = document.createElement("h2");
    fullName.innerText = localStorage.getItem("FullName");
    fullName.classList.add("title__text");
    mainElement.appendChild(fullName);

    const div = document.createElement("div");
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "radar-chart");
    div.appendChild(canvas);
    mainElement.appendChild(div);

    var TF = 0;
    var AM = 0;
    var AU = 0;
    var ZE = 0;
    var OC = 0;
    var DV = 0;
    var UI = 0;
    var LS = 0;
    for (var key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        var value = localStorage[key];
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          var num = parseFloat(value);
          if (key == 1 || key == 9 || key == 17 || key == 25 || key == 33) {
            TF += num;
          }
          if (key == 2 || key == 10 || key == 18 || key == 26 || key == 34) {
            AM += num;
          }
          if (key == 3 || key == 11 || key == 19 || key == 27 || key == 35) {
            AU += num;
          }
          if (key == 4 || key == 12 || key == 20 || key == 28 || key == 36) {
            ZE += num;
          }
          if (key == 5 || key == 13 || key == 21 || key == 29 || key == 37) {
            OC += num;
          }
          if (key == 6 || key == 14 || key == 22 || key == 30 || key == 38) {
            DV += num;
          }
          if (key == 7 || key == 15 || key == 23 || key == 31 || key == 39) {
            UI += num;
          }
          if (key == 8 || key == 16 || key == 24 || key == 32 || key == 40) {
            LS += num;
          }
        }
      }
    }
    TF /= 5;
    AM /= 5;
    AU /= 5;
    ZE /= 5;
    OC /= 5;
    DV /= 5;
    UI /= 5;
    LS /= 5;

    localStorage.setItem("TF", TF);
    localStorage.setItem("AM", AM);
    localStorage.setItem("AU", AU);
    localStorage.setItem("ZE", ZE);
    localStorage.setItem("OC", OC);
    localStorage.setItem("DV", DV);
    localStorage.setItem("UI", UI);
    localStorage.setItem("LS", LS);

    var attributen = ["TF", "AM", "AU", "ZE", "OC", "DV", "UI", "LS"];

    var scores = [];
    for (var i = 0; i < attributen.length; i++) {
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
        scale: {
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 10,
            stepSize: 2,
          },
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Scores per Attribuut",
        },
      },
    };

    var ctx = document.getElementById("radar-chart").getContext("2d");
    new Chart(ctx, config);

    const intro = document.createElement("h2");
    intro.innerText = "Beschrijving van de loopbaanankers";
    intro.classList.add("title__text");
    mainElement.appendChild(intro);

    const introInfo = document.createElement("p");
    introInfo.innerText =
      "Een korte beschrijving van de ankers staat hieronder vermeld. Lees de beschrijving van de ankers die het meest op jou van toepassing zijn en kijk welke daarvan voor jou herkenbaar zijn.";
    introInfo.classList.add("explanation__text");
    mainElement.appendChild(introInfo);
    let uitlegScores = [
      {
        title: "Technisch/functioneel (TF)",
        score: TF,
        description:
          "Mensen met dit anker kenmerken zich door hun kennis, vaardigheden of 'ambachtelijkheid' op een bepaald gebied. Zij zoeken voortdurend naar nieuwe uitdagingen binnen hun specifieke vakgebied, zodat zij zichzelf constant kunnen ontwikkelen en naar een hoger niveau kunnen tillen. Zij identificeren zichzelf met het uitoefenen en toepassen van hun specifieke kennis of vaardigheden en streven ernaar om de beste in hun vakgebied te worden. Hun grootste uitdaging is dat ze soms belast worden met taken die meer generalistisch of leidinggevend van aard zijn, waarin ze mislukken en die ze verafschuwen omdat deze taken hen dwingen om zich bezig te houden met competentiegebieden die niet aansluiten bij hun expertise.",
      },
      {
        title: "Algemeen management (AM)",
        score: AM,
        description:
          "Mensen met dit anker kenmerken zich door hun leiderschapskwaliteiten, hun vermogen om functies te integreren en verantwoordelijkheid te dragen voor een afdeling of organisatie. Hun loopbaanontwikkeling bestaat uit het bekleden van steeds hogere en meer verantwoordelijke posities binnen een organisatie. Ze willen verantwoordelijkheid dragen en aansprakelijk zijn voor het uiteindelijke resultaat. Ze schrijven het succes van een project of organisatie graag toe aan hun bekwame leiderschapsstijl. Hun vaardigheden worden gekenmerkt door analytische vaardigheden, het vermogen om effectief te communiceren met individuen en groepen, en de eigenschap om grote verantwoordelijkheden aan te kunnen.",
      },
      {
        title: "Autonomie/onafhankelijkheid (AU)",
        score: AU,
        description:
          "Mensen met dit anker hechten veel belang aan autonomie en onafhankelijkheid. Zij willen de vrijheid hebben om hun werk op hun eigen manier te definiëren en in te richten, en willen in staat zijn om autonoom te handelen. Vaak kiezen deze mensen voor een zelfstandig bestaan of voor een baan met een hoge mate van autonomie waarin zij zelf kunnen bepalen hoe en wanneer zij werken. Zij zijn bereid promoties of verbeteringen af te wijzen als daardoor hun autonomie in gevaar komt. Voorbeelden van beroepen waarin deze mensen kunnen gedijen zijn zelfstandige adviseurs, docenten of onderwijzers, (kleine) zelfstandige ondernemers, vertegenwoordigers of freelancers.",
      },
      {
        title: "Zekerheid en stabiliteit (ZE)",
        score: ZE,
        description:
          "Mensen met dit anker streven bij het opbouwen en inrichten van hun loopbaan naar stabiliteit en zekerheid op de langere termijn. Ze voelen zich pas echt op hun gemak wanneer ze in hun loopbaan een bepaald niveau van succes en stabiliteit hebben bereikt. Dit gevoel van succes omvat financiële zekerheid en de garantie van een vaste baan. Om deze zekerheden te behouden, zijn ze bereid te voldoen aan de verwachtingen van hun werkgever. Ze zijn minder geïnteresseerd in de inhoud van hun werk of in het nastreven van een hogere positie op basis van hun potentieel. Voor hen is het gevoel van zekerheid en veiligheid belangrijker dan de vraag wat voor werk ze precies doen.",
      },
      {
        title: "Ondernemingsgerichte creativiteit (OC)",
        score: OC,
        description:
          "Mensen met dit anker hebben de behoefte om hun persoonlijke creativiteit te uiten door iets op te bouwen dat groter is dan henzelf. Ze onderscheiden zich door hun vermogen om hun eigen onderneming te creëren als resultaat van hun eigen inspanningen. Ze identificeren zich volledig met hun onderneming en beschouwen het succes ervan als een bewijs van hun eigen talenten. Deze behoefte is zo sterk dat ze bereid zijn om de nodige mislukkingen te accepteren bij het streven naar ultiem succes. Ze zijn bereid om risico's te nemen en obstakels te overwinnen.",
      },
      {
        title: "Dienstverlening/toewijding aan de zaak (DV)",
        score: DV,
        description:
          "Mensen met dit anker hechten veel waarde aan werk dat bijdraagt aan een hoger doel en iets van waarde oplevert. Ze willen zich inzetten voor de leefbaarheid van de wereld, aandacht besteden aan milieuproblemen en bijdragen aan de ontwikkeling van mensen. Door middel van hun beroep en het werkveld waarin ze werkzaam zijn, willen ze uitdrukking geven aan zaken en onderwerpen waar zij waarde aan hechten, bijvoorbeeld door iets te geven, te genezen, te verzorgen, te begeleiden of te adviseren.",
      },
      {
        title: "Zuivere uitdaging (UI)",
        score: UI,
        description:
          "Mensen met dit anker hebben voornamelijk behoefte aan nieuwe kansen en variatie, aan schijnbaar onoverkomelijke obstakels of sterke concurrenten waartegen zij het kunnen opnemen. Het soort werk dat zij doen is minder belangrijk dan het plezier dat zij beleven aan het wedijveren met anderen of het overwinnen van obstakels of tegenstanders. Als zij er niet in slagen om steeds uitdagendere obstakels te vinden, kan het werk saai worden en zullen zij elders op zoek gaan naar nieuwe uitdagingen. Sommigen vinden hun uitdaging in intellectueel werk, sommigen in het analyseren en oplossen van complexe situaties en anderen in het concurreren met anderen.",
      },
      {
        title: "Levensstijl (LS)",
        score: LS,
        description:
          "Mensen met dit anker hechten waarde aan het integreren van werk en gezin. Het is voor hen van groot belang dat hun loopbaan, gezinsleven en persoonlijke waarden in balans zijn, zodat werk en leven aansluiten op hun persoonlijkheid en privéleven. Sommigen passen hun werk aan op de carrière van hun partner, terwijl anderen op zoek gaan naar een baan in de buurt van de omgeving waarin ze willen wonen, waar ze hun kinderen willen opvoeden of waar hun kinderen naar school kunnen gaan. Voor hen is een succesvol leven niet afhankelijk van een succesvolle loopbaan, maar van hoe het leven als geheel wordt ervaren en hoe zij zich daarin persoonlijk kunnen ontwikkelen. In de huidige tijd groeit de populariteit van dit anker steeds meer.",
      },
    ];

    uitlegScores.sort((a, b) => b.score - a.score);

    uitlegScores.forEach((uitlegScore) => {
      const title = document.createElement("h2");
      title.innerText = uitlegScore.title + " - Score: " + uitlegScore.score;
      title.classList.add("title__text");
      mainElement.appendChild(title);

      const description = document.createElement("p");
      description.innerText = uitlegScore.description;
      description.classList.add("explanation__text");
      mainElement.appendChild(description);
    });

    const resultsNextButton = document.createElement("button");
    resultsNextButton.type = "submit";
    resultsNextButton.classList.add(
      "volgendeStap__button",
      "volgendeStap__button--enabled",
      "volgendeStap__button--margin"
    );
    resultsNextButton.disabled = false;
    resultsNextButton.textContent = "Download Resultaten";

    resultsNextButton.addEventListener("click", () => {
      this.afterResults();
    });
    this.parentElement.appendChild(resultsNextButton);
  }

  afterResults() {
    const downloadButton = document.querySelector(".volgendeStap__button");
    downloadButton.remove();

    window.scrollTo(0, 0);

    html2canvas(document.body).then(function (canvas) {
      const imageData = canvas.toDataURL("image/png");
      const fullName = localStorage.getItem("FullName");
      const downloadLink = document.createElement("a");
      downloadLink.href = imageData;
      downloadLink.download = `${fullName} Loopbaan Anker Resultaten.png`;
      downloadLink.click();
    });

    this.thankYou();
  }

  thankYou() {
    const mainElement = document.getElementsByClassName("main")[0];

    this.parentElement.innerHTML = "";
    const container = document.createElement("div");
    container.classList.add("container");

    const title = document.createElement("div");
    title.classList.add("title");
    const titleText = document.createElement("h1");
    titleText.classList.add("title__text");
    titleText.textContent = "Bedankt!";
    title.appendChild(titleText);

    const explanation = document.createElement("div");
    explanation.classList.add("explanation");
    const explanationText1 = document.createElement("p");
    explanationText1.classList.add("explanation__text");
    explanationText1.innerHTML =
      "Er is zojuist een screenshot gedownload naar uw computer. Om deze screenshot naar de coach te sturen, kunt u deze als bijlage toevoegen aan een e-mail en deze verzenden naar <a href='mailto:email@cindy.com'>email@cindy.com</a>.";
    const explanationText2 = document.createElement("p");
    explanationText2.classList.add("explanation__text");
    explanationText2.textContent = "U kunt de pagina nu afsluiten.";
    explanation.appendChild(explanationText1);
    explanation.appendChild(explanationText2);

    container.appendChild(title);
    container.appendChild(explanation);
    mainElement.appendChild(container);
  }

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
    explanationText.innerText = this.questionNumber + ". " + this.questionText;
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
