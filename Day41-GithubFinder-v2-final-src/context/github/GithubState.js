import React, { useReducer } from "react";
import axios from "axios";
import GithubReducer from "./githubReducer";
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
} from "../types";
import githubContext from "./githubContext";

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== "production") {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_ID;
}

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users
  const searchUsers = (text) => {
    setLoading();

    axios
      .get(
        `https://api.github.com/search/users?q=${text}&users?client_id=${githubClientId}&client_secret=${githubClientSecret}`
      )
      .then((res) =>
        dispatch({
          type: SEARCH_USERS,
          payload: res.data.items,
        })
      );
  };

  // Get User
  const getUser = (username) => {
    setLoading();

    axios
      .get(
        `https://api.github.com/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
      )
      .then((res) =>
        dispatch({
          type: GET_USER,
          payload: res.data,
        })
      );
  };

  // Get Repos
  const getUserRepos = (username) => {
    setLoading();

    axios
      .get(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
      )
      .then((res) =>
        dispatch({
          type: GET_REPOS,
          payload: res.data,
        })
      );
  };

  // Clear Users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });
  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <githubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </githubContext.Provider>
  );
};

export default GithubState;
