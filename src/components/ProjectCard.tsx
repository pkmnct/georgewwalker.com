import React from "react";
import styled from "styled-components";

const ProjectCardBase = styled.figure`
  display: inline-block;
`;

const ProjectCard = (props: any) => {
  console.log(props);
  return <ProjectCardBase {...props} />;
};

export default ProjectCard;
