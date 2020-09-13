import React, { useState, useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from './../UI/ErrorModal';

const IngredientReducer = (currentIngredient, action) => {
  switch(action.type)
  {
    case 'SET':
        return action.ingredients 
    case 'ADD':
        return [...currentIngredient, action.ingredient]
    case 'DELETE':
        return currentIngredient.filter(item => item.id !== action.id)
    default:
      throw new Error('command not found');
  }
}

function Ingredients() {
  const [ userIngredients, dispatch ] = useReducer(IngredientReducer, [])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState();

  const addIngredient = (ingredient) => {
    setIsLoading(true);
    fetch('https://react-hooks-662ae.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setIsLoading(false);
      return res.json()
    })
    .then(res => {
      dispatch( { type: 'ADD', ingredient:{ id: res.name , ...ingredient }  } )
    })
    .catch(err => {
      setIsLoading(false);
      setError(err.message)
    })
  }

  const removeIngredient = (id) => {
    setIsLoading(true);
    fetch(`https://react-hooks-662ae.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(res => {
      setIsLoading(false);
      dispatch({ type: 'DELETE', id: id })
    })

  }

  const onFilterItem = useCallback( (ingredientsdata) => {
    let ingredients = [];
        for(let key in ingredientsdata){
          ingredients.push({
            id: key,
            title: ingredientsdata[key].title,
            amount: ingredientsdata[key].amount
          })
        }
        dispatch({ type: 'SET', 'ingredients': ingredients });
  }, [])

  const onCloseModal = () => {
    setError()
  }

  return (
    <div className="App">
      <IngredientForm 
        isLoading={isLoading}
        addIngredients={addIngredient} 
      />

      <section>
        <Search onFilterItem={onFilterItem} />
        <IngredientList 
          isLoading={isLoading}
          ingredients={userIngredients} 
          onRemoveItem={(id) => removeIngredient(id)} />
      </section>

      {error && <ErrorModal onClose={onCloseModal}>{error}</ErrorModal> }
    </div>
  );
}

export default Ingredients;
