const ProjectDetail = props => {
  const {project} = props
  const {name, imageUrl} = project

  return (
    <li>
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}

export default ProjectDetail
