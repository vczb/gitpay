import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import api from '../../consts'
import { store } from '../../main/app'

import {
  Checkbox,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tooltip,
  FormControl,
  FormHelperText,
  Avatar,
  TextField,
  Typography,
  CircularProgress,
  Menu,
  MenuItem,
  Button,
  withStyles,
} from '@material-ui/core'
import {
  AddBox,
  ViewList,
  Group,
  LibraryBooks,
  Tune,
  Home,
  Web,
  Person,
  ExitToApp,
  Settings,
  FaceSharp,
  Business,
  AccountBalance,
  Payment as PaymentIcon
} from '@material-ui/icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlack } from '@fortawesome/free-brands-svg-icons'

import humanFormat from 'human-format'

import { withRouter } from 'react-router-dom'
import { updateIntl } from 'react-intl-redux'

import nameInitials from 'name-initials'
import isGithubUrl from 'is-github-url'

import {
  Bar,
  Container,
  LeftSide,
  RightSide,
  Logo,
  StyledButton,
  LabelButton,
  StyledAvatar,
  StyledAvatarIconOnly,
  OnlyDesktop,
  MenuMobile,
  IconHamburger
} from './TopbarStyles'

import messagesBr from '../../translations/result/br.json'
import messagesEn from '../../translations/result/en.json'

import messagesBrLocal from '../../translations/generated/br.json'
import messagesEnLocal from '../../translations/generated/en.json'

import LoginButton from '../session/login-button'

const logo = require('../../images/gitpay-logo.png')
const logoGithub = require('../../images/github-logo-alternative.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

const logoLangEn = require('../../images/united-states-of-america.png')
const logoLangBr = require('../../images/brazil.png')

const languagesIcons = {
  en: logoLangEn,
  br: logoLangBr
}

const messages = {
  'br': process.env.NODE_ENV === 'production' ? messagesBr : messagesBrLocal,
  'en': process.env.NODE_ENV === 'production' ? messagesEn : messagesEnLocal
}

const browserLanguage = () => {
  const browserLang = navigator.language.split(/[-_]/)[0]
  if (browserLang === 'pt') {
    return 'br'
  }
  return browserLang
}

const localStorageLang = () => {
  /* eslint-disable no-undef */
  return localStorage.getItem('userLanguage')
}

const logoLang = (lang) => {
  return languagesIcons[lang]
}

const currentUserLanguage = (preferences) => {
  const prefLang = preferences.language
  if (prefLang) {
    /* eslint-disable no-undef */
    localStorage.setItem('userLanguage', prefLang)
  }
  return preferences.language || localStorageLang() || browserLanguage()
}

const isBitbucketUrl = (url) => {
  return url.indexOf('bitbucket') > -1
}

const styles = {
  formControl: {
    width: '100%'
  }
}

class TopBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      anchorEl: null,
      task: {
        url: {
          error: false,
          value: null
        }
      },
      private: false,
      provider: 'github',
      createTaskDialog: false,
      joinSlackDialog: false,
      isActive: false
    }
  }

  componentDidMount () {
    /* eslint-disable no-undef */
    const currentStoredLang = localStorage.getItem('userLanguage')
    this.props.fetchPreferences(this.props.user.id).then(() => {
      if (!currentStoredLang) {
        const currentLangSuccess = currentUserLanguage(this.props.preferences)
        store.dispatch(updateIntl({
          locale: currentLangSuccess,
          messages: messages[currentLangSuccess],
        }))
      }
    }).catch(e => {
      const currentLangError = currentUserLanguage(this.props.preferences)
      store.dispatch(updateIntl({
        locale: currentLangError,
        messages: messages[currentLangError],
      }))
    })
    this.props.info()
  }

  handleChange = (event, checked) => {
    this.setState({ auth: checked })
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleClickDialogCreateTask = () => {
    this.setState({ createTaskDialog: true })
  }

  handleClickDialogCreateTaskClose = () => {
    this.setState({ createTaskDialog: false })
  }

  handleClickDialogSignUser = (e) => {
    e.preventDefault()
    this.props.openDialog('SignupUser')
  }

  handleClickDialogJoinSlack = (e) => {
    this.setState(({ joinSlackDialog: true }))
  }

  handleGithubLink = () => {
    window.open('https://github.com/worknenjoy/gitpay', '_blank')
  }

  handleTeamLink = () => {
    window.location.assign('/#/team')
  }

  handleDocsLink = () => {
    window.open('https://docs.gitpay.me/en')
  }

  handleProvider = (e, option) => {
    e.preventDefault()
    this.setState({ provider: option })
  }

  onChange = (e) => {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    const task = this.state.task
    task[e.target.name].value = e.target.value
    task[e.target.name].error = false
    this.setState(task)
  }

  validURL = (url) => {
    return isGithubUrl(url) || isBitbucketUrl(url)
  }

  handleClickMenuMobile = () => {
    const isActive = this.state.isActive
    this.setState({ isActive: !isActive })
  }

  handleCreateTask = (e) => {
    const url = this.state.task.url.value
    if (this.validURL(url)) {
      if (this.state.private) {
        window.location = `${api.API_URL}/authorize/github/private/?url=${encodeURIComponent(url)}&userId=${this.props.user.id}`
        return
      }
      this.props.createTask({
        private: !!this.state.private,
        url: this.state.task.url.value,
        provider: this.state.provider,
        userId: this.props.user ? this.props.user.id : null
      }, this.props.history)
      this.setState({ createTaskDialog: false })
    }
    else {
      this.setState({
        task: {
          url: {
            error: true
          }
        }
      })
    }
  }

  handlePrivate = (e) => {
    // this.setState({private: !this.state.private}, () => console.log(this.state.private))
    this.setState({ private: !this.state.private })
  }

  handleSignUserDialogClose = () => {
    this.props.closeDialog()
  }

  handleJoinSlackDialogClose = () => {
    this.setState({ joinSlackDialog: false })
  }

  handleHome = () => {
    window.location.assign('/#/profile')
    this.setState({ anchorEl: null })
  }

  handleProfile = (e, id, username) => {
    username ? window.location.assign(`/#/users/${id}-${username}/`) : window.location.assign(`/#/users/${id}`)
    this.setState({ anchorEl: null })
  }

  handleViewTasks = () => {
    this.props.history.push('/tasks/open')
  }

  handleSignOut = () => {
    this.props.history.replace({ pathname: '/' })
    this.props.signOut()
    this.setState({ anchorEl: null })
  }

  switchLang = (lang) => {
    this.setState({ anchorEl: null })
    if (this.props.logged) {
      this.props.updateUser(this.props.user.id, {
        language: lang
      })
    }
    /* eslint-disable no-undef */
    localStorage.setItem('userLanguage', lang)
    store.dispatch(updateIntl({
      locale: lang,
      messages: messages[lang],
    }))
  }

  render () {
    const { completed, user, preferences, dialog } = this.props
    const isLoggedIn = this.props.logged
    const anchorEl = this.state.anchorEl
    const userCurrentLanguage = currentUserLanguage(preferences)
    let channelUserCount = ''
    if (this.props.channelUserCount) {
      const count = humanFormat(this.props.channelUserCount, {
        decimals: 1,
        separator: ''
      })
      channelUserCount = `(${count})`
    }

    return (
      <Bar>
        <Container>
          <LeftSide isActive={ this.state.isActive }>
            <div style={ { display: this.props.hide ? 'none' : 'block' } }>
              <StyledButton href='/'>
                <Logo src={ logo } />
              </StyledButton>
            </div>

            <MenuMobile
              onClick={ this.handleClickMenuMobile }
              variant='text'
              size='small'
            >
              <IconHamburger isActive={ this.state.isActive } />
            </MenuMobile>
          </LeftSide>

          <RightSide isActive={ this.state.isActive }>

            <StyledButton
              onClick={ this.handleClickDialogCreateTask }
              variant='text'
              size='small'
              color='primary'
            >
              <LabelButton>
                <FormattedMessage
                  id='task.actions.create'
                  defaultMessage='Import issue' />
              </LabelButton>
              <AddBox />
            </StyledButton>

            <StyledButton
              onClick={ this.handleViewTasks }
              variant='text'
              size='small'
              color='primary'
            >
              <LabelButton>
                <FormattedMessage
                  id='task.actions.explore'
                  defaultMessage='Explore' />
              </LabelButton>
              <ViewList />
            </StyledButton>

            <StyledButton
              onClick={ this.handleTeamLink }
              variant='text'
              size='small'
              color='primary'
            >
              <LabelButton>
                <FormattedMessage
                  id='task.actions.team'
                  defaultMessage='Team' />
              </LabelButton>
              <Group />
            </StyledButton>

            <StyledButton
              onClick={ this.handleDocsLink }
              variant='text'
              size='small'
              color='primary'
            >
              <LabelButton>
                <FormattedMessage
                  id='task.actions.docs'
                  defaultMessage='Documentation' />
              </LabelButton>
              <LibraryBooks />
            </StyledButton>

            { !isLoggedIn
              ? (<React.Fragment>
                <StyledButton
                  onClick={ this.handleClickDialogSignUser }
                  variant='text'
                  size='small'
                  color='primary'
                >
                  <LabelButton>
                    <FormattedMessage
                      id='task.bar.signin'
                      defaultMessage='Signin' />
                  </LabelButton>
                  <Person />
                </StyledButton>

                <Dialog
                  open={ dialog.open && dialog.target === 'SignupUser' }
                  onClose={ this.handleSignUserDialogClose }
                  aria-labelledby='form-dialog-title'
                >
                  <DialogTitle id='form-dialog-title'>
                    <FormattedMessage id='task.actions.gitpay.call' defaultMessage='Join the Gitpay community' />
                  </DialogTitle>
                  <DialogContent>
                    <LoginButton referer={ this.props.location } size='medium' includeForm />
                  </DialogContent>
                </Dialog>
              </React.Fragment>) : (
                <React.Fragment>
                  <StyledButton
                    onClick={ this.handleMenu }
                    variant='text'
                    size='small'
                    color='primary'
                    id='account-menu'
                  >
                    <Chip
                      avatar={ user.picture_url
                        ? <StyledAvatar
                          alt={ user.username || '' }
                          src={ user.picture_url }
                        />
                        : <StyledAvatar alt={ user.username || '' } src=''>
                          { user.username ? nameInitials(user.username) : <Person /> }
                        </StyledAvatar>
                      }
                      color='secondary'
                      label='Account'
                      onClick={ this.handleMenu }
                    />
                  </StyledButton>
                </React.Fragment>
              )
            }
            { isLoggedIn ? (
              <form onSubmit={ this.handleCreateTask } action='POST'>
                <Dialog
                  open={ this.state.createTaskDialog }
                  onClose={ this.handleClickDialogCreateTaskClose }
                  aria-label='form-dialog-title'
                >
                  <DialogTitle id='form-dialog-title'>
                    <FormattedMessage id='task.actions.insert.new' defaultMessage='Insert a new task' />
                  </DialogTitle>

                  <DialogContent>
                    <DialogContentText>
                      <Typography type='subheading' gutterBottom>
                        <FormattedHTMLMessage
                          id='task.actions.insert.subheading'
                          defaultMessage='Paste the url of an incident of <strong>Github</strong> or <strong>Bitbucket</strong>' />
                      </Typography>
                    </DialogContentText>
                    <FormControl style={ styles.formControl } error={ this.state.task.url.error }>
                      <TextField error={ this.state.task.url.error }
                        onChange={ this.onChange }
                        autoFocus
                        margin='dense'
                        id='url'
                        name='url'
                        label='URL'
                        type='url'
                        fullWidth
                      />
                      { this.state.provider === 'github' &&
                      <FormControl component='fieldset'>
                        <FormGroup aria-label='position' name='position' value={ 'private' } onChange={ this.handlePrivate } row>
                          <FormControlLabel
                            value='private'
                            control={ <Checkbox color='primary' /> }
                            label='private'
                            labelPlacement='right'
                          />
                        </FormGroup>
                      </FormControl>
                      }
                      <div style={ { marginTop: 10, marginBottom: 10 } }>
                        <Button
                          style={ { marginRight: 10 } }
                          color='primary'
                          variant={ this.state.provider === 'github' ? 'contained' : 'outline' }
                          id='github'
                          onClick={ (e) => this.handleProvider(e, 'github') }
                        >
                          <img width='16' src={ logoGithub } />
                          <span style={ { marginLeft: 10 } }>Github</span>
                        </Button>

                        <Button
                          color='primary'
                          variant={ this.state.provider === 'bitbucket' ? 'contained' : 'outline' }
                          id='bitbucket'
                          onClick={ (e) => this.handleProvider(e, 'bitbucket') }
                        >
                          <img width='16' src={ logoBitbucket } />
                          <span style={ { marginLeft: 10 } }>Bitbucket</span>
                        </Button>
                      </div>

                      { this.state.task.url.error &&
                      <FormHelperText error={ this.state.task.url.error }>
                        <FormattedMessage id='task.actions.insert.novalid' defaultMessage='This is not a valid URL' />
                      </FormHelperText>
                      }
                    </FormControl>
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={ this.handleClickDialogCreateTaskClose } color='primary'>
                      <FormattedMessage id='task.actions.cancel' defaultMessage='Cancel' />
                    </Button>
                    <Button disabled={ !completed } onClick={ this.handleCreateTask } variant='contained' color='secondary' >
                      <FormattedMessage id='task.actions.insert.label' defaultMessage='Insert' />
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
            ) : (
              <Dialog
                open={ this.state.createTaskDialog }
                onClose={ this.handleClickDialogCreateTaskClose }
                aria-labelledby='form-dialog-title'
              >
                <DialogTitle id='form-dialog-title'>
                  <FormattedMessage id='task.actions.gitpay.call' defaultMessage='Join the Gitpay community' />
                </DialogTitle>
                <DialogContent>
                  <LoginButton referer={ this.props.location } size='medium' includeForm />
                </DialogContent>
              </Dialog>
            ) }
            <FormattedMessage id='task.actions.tooltip.language' defaultMessage='Choose your language'>
              { (msg) => (
                <Tooltip id='tooltip-lang' title={ msg } placement='bottom'>
                  <Button style={ { padding: 0 } } id='language-menu' onClick={ this.handleMenu }>
                    { completed ? (
                      <StyledAvatarIconOnly
                        alt={ user.username || '' }
                        src={ logoLang(userCurrentLanguage) }
                      />
                    ) : (
                      <Avatar>
                        <CircularProgress />
                      </Avatar>
                    ) }
                  </Button>
                </Tooltip>
              ) }
            </FormattedMessage>

            <Menu
              id='menu-appbar'
              anchorEl={ anchorEl }
              anchorOrigin={ { vertical: 'top', horizontal: 'right' } }
              transformOrigin={ { vertical: 'top', horizontal: 'right' } }
              open={ anchorEl && anchorEl.id === 'language-menu' }
              onClose={ this.handleClose }
            >
              <MenuItem selected={ userCurrentLanguage === 'en' } onClick={ (e) => this.switchLang('en') }>
                <StyledAvatarIconOnly
                  alt='English'
                  src={ logoLangEn }
                />
                <strong style={ { display: 'inline-block', margin: 10 } }>English</strong>
              </MenuItem>
              <MenuItem selected={ userCurrentLanguage === 'br' } onClick={ (e) => this.switchLang('br') }>
                <StyledAvatarIconOnly
                  alt='Português'
                  src={ logoLangBr }
                />
                <strong style={ { display: 'inline-block', margin: 10 } }>Português</strong>
              </MenuItem>
            </Menu>

            <OnlyDesktop>
              <FormattedMessage id='task.actions.tooltip.git' defaultMessage='See our project on Github'>
                { (msg) => (
                  <Tooltip id='tooltip-github' title={ msg } placement='bottom'>
                    <StyledAvatarIconOnly
                      alt={ user.username || '' }
                      src={ logoGithub }
                      onClick={ this.handleGithubLink }
                    />
                  </Tooltip>
                ) }
              </FormattedMessage>
              <Drawer id='menu-appbar-language' open={ anchorEl && anchorEl.id === 'account-menu' } onClose={ this.handleClose } anchor={ 'right' }>
                <List>
                  <ListItem>
                    <ListItemText>
                      <Chip
                        avatar={ user.picture_url
                          ? <StyledAvatar
                            alt={ user.username || '' }
                            src={ user.picture_url }
                          />
                          : <StyledAvatar alt={ user.username || '' } src=''>
                            { user.username ? nameInitials(user.username) : <Person /> }
                          </StyledAvatar>
                        }
                        color='secondary'
                        label={ `${user.name || user.username} (${user.email})` }
                      />
                    </ListItemText>
                  </ListItem>
                  <ListItem button onClick={ this.handleHome }>
                    <ListItemIcon>
                      <Home />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.dashboard' defaultMessage='Dashboard' />
                    </ListItemText>
                  </ListItem>
                  <ListItem button onClick={ (e) => this.handleProfile(e, user.id, user.username) }>
                    <ListItemIcon>
                      <Web />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.page' defaultMessage='Profile page' />
                    </ListItemText>
                  </ListItem>
                  { user.Types && user.Types.map(t => t.name).includes('maintainer') &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/tasks')
                    this.setState({ anchorEl: null })
                  } }>
                    <ListItemIcon>
                      <LibraryBooks />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.issues' defaultMessage='Your issues' />
                    </ListItemText>
                  </ListItem>
                  }
                  { user.Types && user.Types.map(t => t.name).includes('maintainer') &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/user/orgs')
                    this.setState({ anchorEl: null })
                  } }>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.orgs' defaultMessage='Your Organizations' />
                    </ListItemText>
                  </ListItem>
                  }
                  { user.Types && (user.Types.map(t => t.name).includes('funding') || user.Types.map(t => t.name).includes('maintainer')) &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/payments')
                    this.setState({ anchorEl: null })
                  } }>
                    <ListItemIcon>
                      <PaymentIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.payments.topmenu' defaultMessage='Your payments' />
                    </ListItemText>
                  </ListItem>
                  }
                  { user.Types && user.Types.map(t => t.name).includes('contributor') &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/payment-options')
                    this.setState({ anchorEl: null })
                  } }>
                    <ListItemIcon>
                      <AccountBalance />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.bank' defaultMessage='Setup Bank Account' />
                    </ListItemText>
                  </ListItem>
                  }
                  { user.Types && user.Types.map(t => t.name).includes('contributor') &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/preferences')
                    this.setState({ anchorEl: null })
                  } }>
                    <ListItemIcon>
                      <Tune />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.skills' defaultMessage='Set skills' />
                    </ListItemText>
                  </ListItem>
                  }
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/settings')
                    this.setState({ anchorEl: null })
                  } }>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.settings' defaultMessage='Settings' />
                    </ListItemText>
                  </ListItem>
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/roles')
                    this.setState({ anchorEl: null })
                  } }>
                    <ListItemIcon>
                      <FaceSharp />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.roles' defaultMessage='Roles' />
                    </ListItemText>
                  </ListItem>
                  <ListItem button onClick={ this.handleSignOut }>
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.logout' defaultMessage='Logout' />
                    </ListItemText>
                  </ListItem>

                </List>
              </Drawer>
            </OnlyDesktop>

            <StyledButton
              onClick={ this.handleClickDialogJoinSlack }
              size='small'
              color='primary'
            >
              <LabelButton>
                <FormattedMessage id='task.bar.slack.count' defaultMessage='Join our Slack {count}' values={ { count: channelUserCount } } />
              </LabelButton><FontAwesomeIcon icon={ faSlack } size='2x' />
            </StyledButton>
            <Dialog
              open={ this.state.joinSlackDialog }
              onClose={ this.handleJoinSlackDialogClose }
              aria-labelledby='form-dialog-title'
            >
              <DialogTitle id='form-dialog-title'>
                <FormattedMessage id='task.actions.slack.call' defaultMessage='Join our Slack channel' />
              </DialogTitle>
              <DialogContent>
                <Grid container justify='center'>
                  <Grid item>
                    <Button
                      href={ process.env.SLACK_CHANNEL_INVITE_LINK }
                      variant='outline'
                      size='medium'
                      color='secondary'
                    >
                      <FontAwesomeIcon icon={ faSlack } size='2x' />
                      <LabelButton right>
                        <FormattedMessage id='form.slack.join.label' defaultMessage='Join channel!' />
                      </LabelButton>
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          </RightSide>
        </Container>
      </Bar>
    )
  }
}

TopBar.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  user: PropTypes.object,
  preferences: PropTypes.object,
  fetchPreferences: PropTypes.func,
  createTask: PropTypes.func,
  updateUser: PropTypes.func,
  signOut: PropTypes.func,
  logged: PropTypes.bool,
  completed: PropTypes.bool,
  hide: PropTypes.bool
}

export default withRouter(withStyles(styles)(TopBar))

/* notification badge

<Badge badgeContent={4} color='secondary'>
  <NotificationIcon color='primary'/>
</Badge>
*/
