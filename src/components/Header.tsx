import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import Logo from "./Logo";
import NavigationLink from "../components/NavigationLink";
import Navigation from "../components/Navigation";
import BackgroundHolder from "../components/Backgrounds/Holder";
import ParticlesBackground from "../components/Backgrounds/Particles";
import GradientBackground from "../components/Backgrounds/Gradient";
import Slideshow from "../components/Slideshow";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
`;

const StyledHeader = styled.header`
  text-align: center;
`;

const Header = (props: RouteComponentProps) => {
  const { location } = props;
  const pageIs = (page: string) => location.pathname.indexOf(page) !== -1;

  const [showingSlideshow, setShowingSlideshow] = useState(pageIs("photo"));
  const [showingParticles, setShowingParticles] = useState(pageIs("web"));
  const [hovering, setHovering] = useState("");

  const handleWebMouseEnter = () => {
    setShowingParticles(true);
    setHovering("web");
  };

  const handleWebMouseLeave = () => {
    !pageIs("web") && setShowingParticles(false);
    setHovering("");
  };

  const handlePhotoMouseEnter = () => {
    setShowingSlideshow(true);
    setHovering("photo");
  };

  const handlePhotoMouseLeave = () => {
    !pageIs("photo") && setShowingSlideshow(false);
    setHovering("");
  };

  // Keep backgrounds for each section
  useEffect(() => {
    setShowingParticles(false);
    setShowingSlideshow(false);
    const pageIs = (page: string) => location.pathname.indexOf(page) !== -1;
    if (pageIs("web")) {
      setShowingParticles(true);
    } else if (pageIs("photo")) {
      setShowingSlideshow(true);
    }
  }, [location.pathname]);

  return (
    <>
      <GradientBackground showing />
      <ParticlesBackground showing={showingParticles} />
      <BackgroundHolder showing={showingSlideshow && !(hovering === "web")}>
        <Slideshow
          isPlaying={showingSlideshow}
          images={[
            "/images/05.03.15.BSFSLightning.01.jpg",
            "/images/03.08.15.Birds.GW.01.jpg"
          ]}
        />
      </BackgroundHolder>
      <StyledHeader>
        <StyledLink to="/">
          <Logo />
        </StyledLink>
        <Navigation>
          <NavigationLink to="/software/">Software Engineer</NavigationLink>
          <NavigationLink
            to="/web/"
            onMouseEnter={handleWebMouseEnter}
            onMouseLeave={handleWebMouseLeave}
          >
            Web Developer
          </NavigationLink>
          <NavigationLink
            to="/photo/"
            onMouseEnter={handlePhotoMouseEnter}
            onMouseLeave={handlePhotoMouseLeave}
          >
            Photographer
          </NavigationLink>
          <NavigationLink to="/tech/">Tech Enthusiast</NavigationLink>
        </Navigation>
      </StyledHeader>
    </>
  );
};

export default withRouter(Header);
