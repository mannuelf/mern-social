import React, {Fragment} from 'react';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const ProfileItem = ({
 profile: {
   user,
   status,
   company,
   location,
   skills
 }
}) => {
  return (<div className="profile bg-light">
    {user && user.name ? <Fragment>
      <div>
        <img src={user.avatar} alt={user.name} className="round-img" />
      </div>
      <div>
        <h2>{user.name}</h2>
        <h2>{status} {company && <span>at {company}</span>}</h2>
        <p>{location && <span>{location}</span>}</p>
        <Link
          to={`/profile/${user._id}`}
          className="btn btn-primary">
          View Profile
        </Link>
        <ul>
          {skills.slice(0,4).map((skill, index) => (
            <li key={index} className="text-primary">
              <i className="fas fa-check"/>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </Fragment> : "Sorry no user, please create one"}

  </div>)
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
}
export default ProfileItem;
