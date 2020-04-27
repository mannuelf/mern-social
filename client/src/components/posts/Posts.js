import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux"
import {getPosts} from "../../store/actions/posts";
import Spinner from "../layout/Spinner";

const Posts = ({getPosts, post: { posts, loading}}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts])
  return (
    <div>

    </div>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object,isRequired
};

const mapStateToProps = state => ({
  posts: state.post,
})

export default connect(mapStateToProps, {getPosts})(Posts);
