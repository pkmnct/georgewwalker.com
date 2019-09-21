import React, { useState, useEffect } from "react";
import Section from "../components/Section";
import Octokit, { ReposGetResponse } from "@octokit/rest";
import classnames from "classnames";
import Title from "../components/Title";
import ProjectCard from "../components/ProjectCard";

const excludedRepos = [
  "gallery-part-1-pkmnct",
  "625-hw4",
  "pkmnct.github.io",
  "staging.georgewwalker.com"
];

const getMarkdownH1 = (markdown: string): string => {
  const h2Index = markdown.indexOf("## ");
  const h1Index = markdown.indexOf("# ");
  if (h2Index !== -1 && h2Index < h1Index) {
    // The first heading wasn't h1, skip it
    let newMarkdown = markdown.slice(h2Index);
    newMarkdown = newMarkdown.slice(newMarkdown.indexOf("\n"));
    return getMarkdownH1(newMarkdown);
  } else {
    let h1 = markdown.slice(h1Index + 2);
    h1 = h1.slice(0, h1.indexOf("\n"));
    return h1;
  }
};

const replacer = (k: any, v: any) => {
  if (v === undefined || typeof v === "function") {
    return null;
  }
  return v;
};

const Software = () => {
  const sessionRepos = sessionStorage.getItem("repos");
  const [repos, setStateRepos] = useState(
    sessionRepos ? JSON.parse(sessionRepos) : {}
  );
  const setRepos = (repos: any) => {
    sessionStorage.setItem("repos", JSON.stringify(repos, replacer));
    setStateRepos(repos);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading && Object.keys(repos).length === 0) {
      const octokit = new Octokit();
      octokit.repos
        .listForUser({ username: "pkmnct", type: "all", sort: "updated" })
        .then(({ data }) => {
          let filtered = data.filter(
            (repo: ReposGetResponse) =>
              !excludedRepos.includes(repo.name) && !repo.fork && !repo.archived
          );
          filtered.sort((a: ReposGetResponse, b: ReposGetResponse) =>
            (a.stargazers_count + a.watchers_count) / 2 >
            (b.stargazers_count + b.watchers_count) / 2
              ? -1
              : (a.stargazers_count + a.watchers_count) / 2 <
                (b.stargazers_count + b.watchers_count) / 2
              ? 1
              : 0
          );
          const getReadmePromises = filtered.reduce(
            (promiseChain: any, repo: any) =>
              promiseChain.then(
                () =>
                  new Promise(resolve => {
                    octokit.repos
                      .getReadme({
                        owner: repo.owner.login,
                        repo: repo.name
                      })
                      .then(readmeData => {
                        repo.name = getMarkdownH1(
                          atob(readmeData.data.content)
                        );
                        resolve();
                      })
                      .catch(() => {
                        // No readme
                        resolve();
                      });
                  })
              ),
            Promise.resolve()
          );
          getReadmePromises.then(() => {
            setRepos(filtered);
            setLoading(false);
          });
        });
    } else {
      setLoading(false);
    }
  }, [repos, loading]);

  return (
    <Section className={classnames({ in: !loading })}>
      <Title>Projects</Title>
      {repos.length &&
        repos.map((repo: any) => (
          <ProjectCard
            description={repo.description}
            url={repo.html_url}
            title={repo.name}
          />
        ))}
    </Section>
  );
};

export default Software;
