import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

const NotFound = props => {
  return (
    <Fragment>
      <h1>Page Not Found</h1>
      <p>Sorry this page does not exist</p>
    </Fragment>
  );
};

NotFound.propTypes = {

};

export default NotFound;
