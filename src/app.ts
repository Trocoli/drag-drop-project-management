// validation 

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: Validatable) {
  let isValid = true;

  if (validatable.required) {
    isValid = isValid && validatable.value.toString().trim().length !== 0;
  }
  if( validatable.minLength != null && typeof validatable.value === 'string'){
    isValid = isValid && validatable.value.length > validatable.minLength;
  }
  if( validatable.maxLength != null && typeof validatable.value === 'string'){
    isValid = isValid && validatable.value.length < validatable.maxLength;
  }
  if (validatable.min != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value >= validatable.min;
  }
  if (validatable.max != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value <= validatable.max;
  }
  return isValid
}

// autobninmd decorater
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedHtmlContent = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedHtmlContent.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserIput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDesc = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const validatableTitle: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 5,
      maxLength: 10,
    }

    const validatableDesc: Validatable = {
      value: enteredDesc,
      required: true,
      minLength: 10,
      maxLength: 100,
    }

    const validatablePeople: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 3,
      max: 100,
    }


    if (
      !validate(validatableTitle) ||
      !validate(validatableDesc) ||
      !validate(validatablePeople)

    ) {
      alert("Invalid Input");
      return;
    } else {
      return [enteredTitle, enteredDesc, +enteredPeople];
    }
  }


  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserIput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();       
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
