document.querySelectorAll('fieldset > p')[2].children[0].addEventListener('click', addForm)
document.querySelector('#save_to_json').addEventListener('click', saveToJson)

function createFirstParagraph(type) {
  const paragraph = document.createElement('p');
  const label = document.createElement('label');

  label.classList.add('label-style1')
  label.appendChild(document.createTextNode('Condition'))
  paragraph.appendChild(label)

  const select1 = document.createElement('select');
  if (type === 'Text') {
    const optionsEquals = document.createElement('option')
    optionsEquals.appendChild(document.createTextNode('Equals'))
    select1.appendChild(optionsEquals)
    const input = document.createElement('input')
    input.classList.add('small_input')
    paragraph.appendChild(select1)
    paragraph.appendChild(input)
  } else if (type === 'Number') {
    const optionsEquals = document.createElement('option')
    const optionsGreater = document.createElement('option')
    const optionsLess = document.createElement('option')
    optionsEquals.appendChild(document.createTextNode('Equals'))
    optionsGreater.appendChild(document.createTextNode('Greater'))
    optionsLess.appendChild(document.createTextNode('Less'))
    select1.appendChild(optionsEquals)
    select1.appendChild(optionsGreater)
    select1.appendChild(optionsLess)
    const input = document.createElement('input')
    input.classList.add('small_input')

    paragraph.appendChild(select1)
    paragraph.appendChild(input)
  } else if (type === 'Yes/No') {
    const optionsEquals = document.createElement('option');
    optionsEquals.appendChild(document.createTextNode('Equals'))
    select1.appendChild(optionsEquals)
    const select2 = document.createElement('select');
    const optionYes = document.createElement('option')
    const optionNo = document.createElement('option')

    optionYes.appendChild(document.createTextNode('Yes'))
    optionNo.appendChild(document.createTextNode('No'))

    select2.appendChild(optionYes)
    select2.appendChild(optionNo)

    paragraph.appendChild(select1)
    paragraph.appendChild(select2)
  }
  paragraph.classList.add('condition_paragraph')
  return paragraph
}

function createSecondParagraph() {
  const paragraph = document.createElement('p');
  const label = document.createElement('label');
  const input = document.createElement('input');
  label.classList.add('label-style1')
  input.classList.add('input')

  label.appendChild(document.createTextNode('Question'))
  paragraph.classList.add('question_paragraph')
  paragraph.appendChild(label)
  paragraph.appendChild(input)

  return paragraph
}

function createThirdParagraph() {
  const paragraph = document.createElement('p');
  const label = document.createElement('label');
  const select = document.createElement('select');
  const optionDefault = document.createElement('option');
  const optionYes = document.createElement('option');
  const optionNo = document.createElement('option');
  label.classList.add('label-style2')

  optionDefault.appendChild(document.createTextNode('Yes/No'))
  optionYes.appendChild(document.createTextNode('Number'))
  optionNo.appendChild(document.createTextNode('Text'))

  optionDefault.selected = true

  select.appendChild(optionDefault)
  select.appendChild(optionYes)
  select.appendChild(optionNo)
  label.appendChild(document.createTextNode('Type'))

  paragraph.classList.add('type_paragraph')
  paragraph.appendChild(label)
  paragraph.appendChild(select)
  return paragraph
}

function createAddFormButton() {
  const paragraph = document.createElement('p');
  const button = document.createElement('button');
  paragraph.classList.add('button')
  button.appendChild(document.createTextNode('Add form'))
  button.addEventListener('click', addForm);
  paragraph.appendChild(button)
  return paragraph
}

function createSubFormButton() {
  const paragraph = document.createElement('p');
  const button = document.createElement('button');
  paragraph.classList.add('button')
  button.appendChild(document.createTextNode('Create subform'))
  button.addEventListener('click', createSubFormElement);
  paragraph.appendChild(button)
  return paragraph
}

function addForm() {
  const parent = this.parentNode.parentNode
  this.remove() // removes the button
  const nextFieldset = document.createElement('fieldset');
  nextFieldset.classList.add('border')

  nextFieldset.appendChild(createSecondParagraph());
  nextFieldset.appendChild(createThirdParagraph());
  nextFieldset.appendChild(createAddFormButton());
  nextFieldset.setAttribute('margin', 0)
  nextFieldset.setAttribute('created', false)
  parent.setAttribute('created', true)
  document.body.insertBefore(nextFieldset, parent.nextSibling);
  document.body.insertBefore(document.createElement('br'), nextFieldset);
  const type = parent.querySelector('.type_paragraph > select')
  const question = parent.querySelector('.question_paragraph > input')
  question.disabled = true
  type.disabled = true
  parent.appendChild(createSubFormButton());
}

function createSubFormElement() {
  const parent = this.parentNode.parentNode
  const nextFieldset = document.createElement('fieldset');
  nextFieldset.classList.add('border')
  const paragraph = parent.querySelector('.type_paragraph')
  nextFieldset.appendChild(createFirstParagraph(paragraph.querySelector('select').value));
  nextFieldset.appendChild(createSecondParagraph());
  nextFieldset.appendChild(createThirdParagraph());
  nextFieldset.appendChild(createAddSubFormButton());
  const margin = parseInt(parent.getAttribute('margin'), 10)
  nextFieldset.style = `margin-left:${margin + 100}px;`
  nextFieldset.setAttribute('margin', margin + 100)
  nextFieldset.previousFieldset = parent
  nextFieldset.setAttribute('created', false)
  document.body.insertBefore(nextFieldset, parent.nextSibling);
}

function createAddSubFormButton() {
  const paragraph = document.createElement('p');
  const button = document.createElement('button');
  paragraph.classList.add('button')
  button.appendChild(document.createTextNode('Add form'))
  button.addEventListener('click', addSubForm);
  paragraph.appendChild(button)
  return paragraph
}

function addSubForm() {
  const parent = this.parentNode.parentNode
  this.remove() // removes the button
  const type = parent.querySelector('.type_paragraph > select')
  const question = parent.querySelector('.question_paragraph > input')
  const conditions = parent.querySelectorAll('.condition_paragraph > select')
  conditions[0].disabled = true
  if (conditions[1]) {
    conditions[1].disabled = true
  } else {
    parent.querySelector('.condition_paragraph > input').disabled = true
  }


  type.disabled = true
  question.disabled = true
  parent.setAttribute('created', true)
  parent.appendChild(createSubFormButton());
}

function saveToJson() {
  const fieldsets = document.querySelectorAll('fieldset')
  const forms = []
  let margin = 0
  let type = ''
  let question = ''
  let conditions = []
  let conditionType = ''
  let conditionValue = ''
  let parentObjectSubforms = []
  for (const fieldset of fieldsets) {
    if (fieldset.getAttribute('created') === 'false') {
      continue
    }
    margin = parseInt(fieldset.getAttribute('margin'), 10)
    type = fieldset.querySelector('.type_paragraph > select').value
    question = fieldset.querySelector('.question_paragraph > input').value
    if (margin === 0) {
      forms.push({
        conditionType: null,
        conditionValue: null,
        question,
        type,
        subforms: []
      })
    } else {
      conditions = fieldset.querySelectorAll('.condition_paragraph > select')
      conditionType = conditions[0].value
      if (conditions[1]) {
        conditionValue = conditions[1].value
      } else {
        conditionValue = fieldset.querySelector('.condition_paragraph > input').value
      }
      parentObjectSubforms = forms[forms.length - 1].subforms
      // finds the form for which the given subform is parented too, the margin attribute of the direct parent
      // is always equal to margin of the child - 100
      while (margin !== 100) {
        parentObjectSubforms = parentObjectSubforms[parentObjectSubforms.length - 1].subforms
        margin = margin- 100
      }
      parentObjectSubforms.push({
        conditionType,
        conditionValue,
        question,
        type,
        subforms: [],
      })
    }
  }
  const formsJson = JSON.stringify(forms);
  localStorage.setItem('forms', formsJson) // saves to browser's local storage
}
