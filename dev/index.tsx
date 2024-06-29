import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import './styles.css'

import Home from './Home'
import { UserProfilePage } from './user-profile'
import { RootLayout } from './root-layout'
import { SignInPage } from './sign-in'
import { SignUpPage } from './sign-up'

render(
  () => (
    <Router root={RootLayout}>
      <Route path="/" component={Home} />
      <Route path="/user/*" component={UserProfilePage} />
      <Route path="/sign-in/*" component={SignInPage} />
      <Route path="/sign-up/*" component={SignUpPage} />
    </Router>
  ),

  document.getElementById('root')!,
)
