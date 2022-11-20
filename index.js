const $wr = document.querySelector('[data-wr]')
const $openModalBtn = document.querySelector('[data-open_modal]')
const $modalAdd = document.querySelector('[data-form-add]')
const $closeModal = document.querySelector('[data-close_modal]')
const $showCatDOM = document.querySelector('[data-show-cat]')


const generateCardCat = (cat) => {
  return `
  <div data-card_id=${cat.id} class="card" style="">
      <img src="${cat.img_link}" class="card-img-top" alt="${cat.name}">
      <div class="card-body">
          <h5 class="card-title">${cat.name}, ${cat.age}</h5>
          <p class="card-text">${cat.description}</p>
          <div class="card__rating">
              Rating: ${cat.rate} <i class="fa-solid fa-cat"></i>
          </div>
          <div class="btn_wr">
            <button data-action='show' class="btn btn-primary">Show</button>
            <button data-action='delete' class="btn btn-danger">Delete</button>
          </div>
      </div>
  </div>`
}

const generateShowCat = (cat) => {
  return `
  <div class="modal-wr">
      <div class="custom-modal">
        <div data-showCat class="wr_showCat">
          <div class="show-cat">
            <img src="${cat.img_link}" alt="">
            <div class="show-cat-body">
              <h5>${cat.name}, ${cat.age}</h5>
              <p>${cat.description}</p>
              <button data-action='close' class="btn btn-danger">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async getAllCats() {
    const response = await fetch(`${this.baseUrl}/show`);

    return response.json();
  }

  async getShowCat(showCatId) {
    const response = await fetch(`${this.baseUrl}/show/${showCatId}`)
    return response.json()
  }


  async deleteCat(catId) {
    const response = await fetch(`${this.baseUrl}/delete/${catId}`, {
      method: 'DELETE'
    });
    if (response.status !== 200) {
      throw new Error()
    }
  }

  async addCat(data) {
    const response = await fetch(`${this.baseUrl}/add`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.status !== 200) {
      throw new Error()
    }
  }
}

const api = new API('https://sb-cats.herokuapp.com/api/2/sadreevartem')

api.getAllCats().then((responseFromBackend) => responseFromBackend.data.forEach(cat => {
  $wr.insertAdjacentHTML('beforeend', generateCardCat(cat))
}))

$wr.addEventListener('click', (e) => {
  console.log(e.target.dataset.action);

  switch (e.target.dataset.action) {
    case 'delete':
      const $cardWr = e.target.closest('[data-card_id]')
      const catId = $cardWr.dataset.card_id
      console.log($cardWr, catId);
      api.deleteCat(catId).then(() => {
        $cardWr.remove()
      })
      break
    case 'show':
      const showCatId = e.target.closest('[data-card_id]').dataset.card_id
      api.getShowCat(showCatId).then((responseFB) => {
        const objCat = responseFB.data
        $showCatDOM.classList.remove('hidden')
        $showCatDOM.insertAdjacentHTML('beforeend', generateShowCat(objCat))
      })
    default: break
  }
})

document.forms.add_cat.addEventListener('submit', (e) => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target).entries())
  data.id = +data.id
  data.rate = +data.rate
  data.age = +data.age
  data.favorite = data.favorite === 'on'

  api.addCat(data).then(() => {
    $wr.insertAdjacentHTML('beforeend', generateCardCat(data))
    $modalAdd.classList.add('hidden')
    e.target.reset()
  }).catch(alert)
})

$openModalBtn.addEventListener('click', () => {
  $modalAdd.classList.remove('hidden')
})

$closeModal.addEventListener('click', () => {
  $modalAdd.classList.add('hidden')
})

$showCatDOM.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'close') {
    $showCatDOM.classList.add('hidden')
  }
})