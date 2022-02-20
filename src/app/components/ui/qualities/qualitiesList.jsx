import React from "react";
import PropTypes from "prop-types";
import { useQualities } from "../../../hooks/useQualities";

const QualitiesList = ({ qualities }) => {
    const { getQuality } = useQualities();
    return qualities.map((element) => {
        const qual = getQuality(element);
        return (
            <button
                className={`btn btn-${qual.color} mx-1 my-1`}
                key={qual._id}
            >
                {qual.name}
            </button>
        );
    });
};

QualitiesList.propTypes = {
    qualities: PropTypes.array
};

export default QualitiesList;
