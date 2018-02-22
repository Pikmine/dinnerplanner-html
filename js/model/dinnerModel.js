//DinnerModel Object factory function
const createDinnerModel = () => {

	// the data structure that will hold number of guest
	// and selected dishes for the dinner menu
	const state = {
		numberOfGuests: 1,
		menu: [],
		observers: []
	}

	const addObserver = (observer) => {
		state.observers.push(observer)
	}

	const removeObserver = (observer) => {
		state.observers = observers.filter(subscribedObserver => subscribedObserver !== observer)
	}

	const _notifyObservers = (details) => {
		state.observers.map(observer => observer(details))
	}

	const setNumberOfGuests = num => {
		state.numberOfGuests = num
		_notifyObservers({ numberOfGuests: state.numberOfGuests })
	}

	const getNumberOfGuests = () => state.numberOfGuests

	// Returns the dish that is on the menu for the selected type
	const getSelectedDish = type => state.menu.find(dish => dish.type === type)

	// Returns all the dishes on the menu.
	const getFullMenu = () => state.menu

	// Returns all ingredients for all the dishes on the menu (represented by dish)
	const getAllIngredients = () => state.menu.reduce((acc, curr) => acc.concat(curr.ingredients), [])

	const getAllIngredientsForDish = dish => {
		return dish.ingredients.map(({ name, quantity, unit, price }) => ({
			name,
			unit,
			quantity: quantity * state.numberOfGuests,
			price: price * state.numberOfGuests
		}))
	}

	// Return the full price of a given dish (represented by dish)
	const getPriceForDish = dish => dish.ingredients.reduce((acc, curr) => {
		acc += state.numberOfGuests * curr.price
		return acc
	}, 0)

	// Returns the total price of the menu (all the ingredients multiplied by number of guests).
	const getTotalMenuPrice = () => getAllIngredients().reduce((acc, curr) => {
		acc += state.numberOfGuests * curr.price
		return acc
	}, 0)

	// Adds the passed dish to the menu. If the dish of that type already exists on the menu
	// it is removed from the menu and the new one added.
	const addDishToMenu = id => {
		const selectedDish = getDish(id)
		const restOfTheMenu = state.menu.filter(dish => dish.type !== selectedDish.type)
		restOfTheMenu.push(selectedDish)
		state.menu = restOfTheMenu
		_notifyObservers({ menu: state.menu })
	}

	// Removes dish from menu
	const removeDishFromMenu = id => {
		const newMenu = state.menu.filter(dish => dish.id !== id)
		state.menu = newMenu
		_notifyObservers({ menu: state.menu })
	}

	// function that returns all dishes of specific type (i.e. "starter", "main dish" or "dessert")
	// you can use the filter argument to filter out the dish by name or ingredient (use for search)
	// if you don't pass any filter all the dishes will be returned
	const getAllDishes = (type, filter) => {
		return new Promise((resolve, reject) => {
			let options = {
				headers: {
					'X-Mashape-Key': apiConfig.apiKey
				}
			};

			let queryParams = [`instructionsRequired=true`];

			if (type !== 'all') {
				queryParams.push(`type=${encodeURIComponent(type)}`);
			}

			if (filter) {
				queryParams.push(`filter=${encodeURIComponent(filter)}`);
			}

			fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?${queryParams.join('&')}`, options)
				.then(res => res.json())
				.then(({ results }) => {
					resolve(results);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	//function that returns a dish of specific ID
	const getDish = id => {
		return new Promise((resolve, reject) => {
			let options = {
				headers: {
					'X-Mashape-Key': apiConfig.apiKey
				}
			};

			let queryParams = [
				`includeNutrition=true`,
				`id=${id}`
			];

			fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/{id}/information?${queryParams.join('&')}`, options)
				.then(res => res.json())
				.then(({ results }) => {
					resolve(results);
				})
				.catch(err => {
					reject(err);
				});
		});
	};

	return ({
		addObserver,
		removeObserver,
		setNumberOfGuests,
		getNumberOfGuests,
		getSelectedDish,
		getFullMenu,
		getAllIngredients,
		getAllIngredientsForDish,
		getPriceForDish,
		getTotalMenuPrice,
		addDishToMenu,
		removeDishFromMenu,
		getAllDishes,
		getDish
	})

}
