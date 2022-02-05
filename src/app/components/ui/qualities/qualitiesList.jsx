import React from "react";
import PropTypes from "prop-types";
import { useQualities } from "../../../hooks/useQualities";

const QualitiesList = ({ id }) => {
  console.log("qualities", id);
  const { getQuality } = useQualities();
  return id.map((element) => {
    const qual = getQuality(element);
    return <button className={`btn btn-${qual.color}`}>{qual.name}</button>;
  });
};

QualitiesList.propTypes = {
  qualities: PropTypes.array,
};

export default QualitiesList;
