import React from 'react';
import './IngredientList.css';

import LoadingIndicator from './../UI/LoadingIndicator';

const IngredientList = props => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <div style={{
        position: 'absolute',
        right: 10,
        bottom:0
      }}>
        {props.isLoading && <LoadingIndicator /> } 
      </div>
      
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
