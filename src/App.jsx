/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import productsFromServer from './api/products';
import categories from './api/categories';
import users from './api/users';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: null,
  });

  const getSortIconClass = column => {
    if (sortConfig.column !== column) {
      return 'fas fa-sort';
    }

    return sortConfig.direction === 'asc'
      ? 'fas fa-sort-up'
      : 'fas fa-sort-down';
  };

  const products = productsFromServer.map(product => {
    const category = categories.find(c => c.id === product.categoryId);
    const owner = category ? users.find(u => u.id === category.ownerId) : null;

    return {
      ...product,
      category: category ? category.title : '',
      categoryIcon: category ? category.icon : '',
      ownerId: owner ? owner.id : null,
      owner: owner ? owner.name : '',
      ownerSex: owner ? owner.sex : '',
      categoryId: category ? category.id : null,
    };
  });

  let filteredProducts = products;

  if (selectedUserId) {
    filteredProducts = filteredProducts.filter(
      p => p.ownerId === selectedUserId,
    );
  }

  if (searchValue) {
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(searchValue.toLowerCase()),
      // eslint-disable-next-line function-paren-newline
    );
  }

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(
      p => selectedCategories.includes(p.categoryId),
      // eslint-disable-next-line function-paren-newline
    );
  }

  if (sortConfig.column) {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const valA = a[sortConfig.column];
      const valB = b[sortConfig.column];

      if (valA < valB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }

      if (valA > valB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  const handleUserClick = userId => {
    setSelectedUserId(userId === 'all' ? null : userId);
  };

  const handleCategoryClick = categoryId => {
    if (categoryId === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(
        prev =>
          prev.includes(categoryId)
            ? prev.filter(id => id !== categoryId)
            : [...prev, categoryId],
        // eslint-disable-next-line function-paren-newline
      );
    }
  };

  const handleReset = () => {
    setSelectedUserId(null);
    setSearchValue('');
    setSelectedCategories([]);
    setSortConfig({ column: null, direction: null });
  };

  const handleSort = column => {
    if (sortConfig.column !== column) {
      setSortConfig({ column, direction: 'asc' });
    } else if (sortConfig.direction === 'asc') {
      setSortConfig({ column, direction: 'desc' });
    } else {
      setSortConfig({ column: null, direction: null });
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={!selectedUserId ? 'is-active' : ''}
                onClick={() => handleUserClick('all')}
              >
                All
              </a>
              {users.map(u => (
                <a
                  key={u.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === u.id ? 'is-active' : ''}
                  onClick={() => handleUserClick(u.id)}
                >
                  {u.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchValue && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchValue('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${selectedCategories.length === 0 ? '' : 'is-outlined'}`}
                onClick={() => handleCategoryClick('all')}
              >
                All
              </a>
              {categories.map(c => (
                <a
                  key={c.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategories.includes(c.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => handleCategoryClick(c.id)}
                >
                  {c.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {filteredProducts.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/" onClick={() => handleSort('id')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={getSortIconClass('id')}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/" onClick={() => handleSort('name')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={getSortIconClass('name')}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/" onClick={() => handleSort('category')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={getSortIconClass('category')}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/" onClick={() => handleSort('owner')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={getSortIconClass('owner')}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.categoryIcon} - {product.category}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        product.ownerSex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
