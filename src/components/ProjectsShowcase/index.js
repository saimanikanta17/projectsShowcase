import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectDetail from '../ProjectDetail'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    category: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    const {category} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${category}`,
    )
    if (response.ok) {
      const data = await response.json()
      const convertedData = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: convertedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeCategory = event => {
    this.setState({category: event.target.value}, this.getProjects)
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderProjectsView = () => {
    const {projectsList} = this.state
    return (
      <ul>
        {projectsList.map(project => (
          <ProjectDetail key={project.id} project={project} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderProjectsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state
    return (
      <div>
        <nav>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <select value={category} onChange={this.changeCategory}>
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderProjects()}
      </div>
    )
  }
}

export default ProjectsShowcase
