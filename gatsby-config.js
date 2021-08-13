module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Вили Ла Коста График`,
        short_name: `Вили Ла Коста График`,
        start_url: `/schedule`,
        background_color: `#3f51b5`,
        theme_color: `#3f51b5`,
        display: `minimal-ui`,
        icon: `src/images/vililogo.png`, // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-typescript",
    "gatsby-plugin-material-ui",
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
