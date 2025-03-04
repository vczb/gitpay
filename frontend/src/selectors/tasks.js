import { createSelector } from 'reselect'

const getVisibilityFilter = (state) => state.tasks.filterType
export const getTasks = (state) => state.tasks
export const getUser = (state) => state.loggedIn.user
export const getProject = (state) => state.project
export const getOrganization = (state) => state.organization.organization

const filterByAdditional = (task, additional, filteredByPrincipal) => {
  const filteringAllOfAdditional = typeof filteredByPrincipal === 'undefined'

  if (additional === 'issuesWithBounties') {
    return filteringAllOfAdditional ? evaluateTaskWithBountyByValue(task.value) : ((filteredByPrincipal) && (evaluateTaskWithBountyByValue(task.value)))
  }

  if (additional === 'contribution') {
    return filteringAllOfAdditional ? evaluateTaskWithoutBountyByValue(task.value) : ((filteredByPrincipal) && (evaluateTaskWithoutBountyByValue(task.value)))
  }

  return task
}

const evaluateTaskWithBountyByValue = (value) => {
  return (parseFloat(value) > parseFloat('0'))
}

const evaluateTaskWithoutBountyByValue = (value) => {
  return parseFloat(value) === parseFloat('0')
}

const getTaskWithAnyOrder = (task) => {
  if (task.Orders.length > 0) {
    return task
  }
}

export const getFilteredTasks = createSelector(
  [getVisibilityFilter, getTasks, getUser, getProject, getOrganization],
  (visibilityFilter, tasks, user, project, organization) => {
    switch (visibilityFilter) {
      case 'all':
        return tasks
      case 'userId':
        return { ...tasks, data: tasks.data.filter(item => item.userId === user.id) }
      case 'Assigns':
        return {
          ...tasks,
          data: tasks.data.filter(item => {
            const interested = item.Assigns.filter(assign => assign.userId === user.id)
            return interested.length
          })
        }
      case 'status':
        return {
          ...tasks,
          data: tasks.data.filter(item => {
            const additionalFilter = tasks.filterAdditional

            if (tasks.filterValue === 'all') {
              return filterByAdditional(item, additionalFilter)
            }
            else {
              const filteredByPrincipal = item.status === tasks.filterValue
              return filterByAdditional(item, additionalFilter, filteredByPrincipal)
            }
          })
        }
      case 'assigned':
        return {
          ...tasks,
          data: tasks.data.filter(item => {
            const interested = item.Assigns.filter(assign => assign.userId === user.id)
            if (interested.length) {
              return item.assigned === interested[0].id
            }
          })
        }
      case 'issuesWithBounties':
        return { ...tasks, data: tasks.data.filter(item => evaluateTaskWithBountyByValue(item.value)) }
      case 'contribution':
        return { ...tasks, data: tasks.data.filter(item => evaluateTaskWithoutBountyByValue(item.value)) }
      case 'supported':
        return { ...tasks,
          data: tasks.data.filter(item => getTaskWithAnyOrder(item)) }
      default:
        return tasks
    }
  }
)
