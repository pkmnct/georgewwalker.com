import styled from "styled-components";

const Section = styled.section`
  display: block;
  flex-grow: 1;
  width: calc(100% - 4em);
  margin: 2em;
  margin-bottom: 0;
  transform: translateY(100%);
  transition: transform ease-in-out 0.5s;
  background: rgba(255, 255, 255, 0.8);
  color: #000;
  padding: 1em;
  &.in {
    transform: none;
  }
`;

export default Section;
