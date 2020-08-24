import { questionArr } from "./data.js";

export default class Quiz {
  constructor() {
    this.state = {
      index: 0,
      wrong: 0,
      correct: 0,
      noQuestions: 10,
      quizData: questionArr
    };
  }

  setState(state) {
    this.state = state;
    this.render();
  }

  render() {
    let container = document.querySelector(".container");
    container.innerHTML = "";
    var checkBtnState =
      this.state.quizData[this.state.index].checked ||
      this.state.quizData[this.state.index].marked === null
        ? "disabled"
        : "";
    var prevBtnState = !this.state.index ? "disabled" : "";
    var nextBtnState =
      this.state.index === this.state.noQuestions - 1 ? "disabled" : "";

    let imageStr =
      this.state.quizData[this.state.index].image != ""
        ? `<img src="${
            this.state.quizData[this.state.index].image
          }" alt="Question Img" class="question-img" />`
        : "";

    let quizBox = document.createElement("div");
    quizBox.className = "quiz-box shadow";
    quizBox.innerHTML = `<div class="quiz-header">
              <span class="info-item">
                <i class="material-icons large">check</i> ${
                  this.state.correct
                } Correct</span
              >
              <span class="info-item">
                <i class="material-icons">close</i> ${
                  this.state.wrong
                } Wrong</span
              >
              <span class="info-item">
                <i class="material-icons">alarm</i> 24s
              </span>
            </div>
            <div class="question-card low-shadow">
              <span class="question-info">Question ${this.state.index + 1} ( ${
      this.state.noQuestions - this.state.index - 1
    } remaining )</span>
              <div class="question">
                ${this.state.quizData[this.state.index].question}
              </div>
              ${imageStr}
              <span class="question-info">Answer Options</span>
              ${this.getOptions()}
            </div>
            <div class="btn-box">
              <button class="btn-2 med-shadow" id="previous" ${prevBtnState}>Previous</button>
              <button class="btn-2 med-shadow" id="check" ${checkBtnState}>Check</button>
              <button class="btn-2 med-shadow" id="next" ${nextBtnState}>Next</button>
            </div>`;
    container.appendChild(quizBox);
    this.handleClicks();
    document.getElementById("previous").addEventListener("click", () => {
      this.moveToQuestion(this.state.index - 1);
    });
    document.getElementById("check").addEventListener("click", () => {
      this.checkAnswer();
    });
    document.getElementById("next").addEventListener("click", () => {
      this.moveToQuestion(this.state.index + 1);
    });
  }

  handleClicks() {
    var options = document.querySelectorAll(".option-box");
    options.forEach(option => {
      option.addEventListener("click", event => {
        this.markOption(event, option.children[0].id);
      });
    });
  }

  getOptions() {
    const activeStyle = "background:#e43f5a;color:white";
    let str = `<div class="answers">`;
    this.state.quizData[this.state.index].options.forEach((option, index) => {
      str += `<div class="option-box" style="${
        this.state.quizData[this.state.index].marked == index
          ? activeStyle
          : null
      }">
        <input type="radio" name="answer" id="${
          (this.state.index, index)
        }" class="answer-option" />
        <span class="option-number">${index + 1}</span>
        <label for="${(this.state.index, index)}" class="answer-label">
          ${option}
        </label>
      </div>`;
    });
    str += `</div>`;
    return str;
  }

  markOption(event, id) {
    if (this.state.quizData[this.state.index].checked) {
      return;
    }
    var newState = this.state;
    newState.quizData[newState.index].marked = id;
    this.setState(newState);
  }

  checkAnswer() {
    let newState = this.state;
    let ques = newState.quizData[this.state.index];
    if (ques.checked || ques.marked === null) {
      return;
    }
    if (ques.options[ques.marked] == ques.answer) {
      newState.correct++;
      ques.checked = true;
      ques.status = true;
    } else {
      newState.wrong++;
      ques.checked = true;
      ques.status = false;
    }
    this.setState(newState);
  }

  moveToQuestion(no) {
    let newState = this.state;
    newState.index = no;
    this.setState(newState);
  }
}
