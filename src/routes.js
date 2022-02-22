// @flow
import type { Route } from "src/helpers/router/route";
import Router from "src/components/router";
import Production from "src/components/router/production";
import Screenplay from "src/components/router/production/screenplay";
import Editor from "src/components/router/production/screenplay/text-editor";
import Stripboard from "src/components/router/production/screenplay/Stripboard";
import Breakdown from "src/components/router/production/screenplay/breakdown";
import CallSheet from "src/components/router/production/screenplay/callsheet";
import Schedule from "src/components/router/production/screenplay/callsheet/schedule";
import People from "src/components/router/production/screenplay/callsheet/people";
import Requirements from "src/components/router/production/screenplay/callsheet/requirements";
import Shots from "src/components/router/production/screenplay/shots";
import Drive from "src/components/router/production/drive";
import Folder from "src/components/router/production/drive/folder";
import NotFound from "src/components/NotFound";
import Username from "src/components/router/auth/ResetPassword/Username";
import NewPassword from "src/components/router/auth/ResetPassword/NewPassword";
import Success from "src/components/router/auth/ResetPassword/Success";
import SignIn from "src/components/router/auth/SignIn";
import SignUp from "src/components/router/auth/signup";
import ProductionDetails from "src/components/router/production/productionDetails";
import Profile from "src/components/router/Profile";
import SetUpPassword from "src/components/router/auth/setUpPassword";
import Invitations from "src/components/router/production/invitations";
import NewTeam from "src/components/router/newTeam";
import NewTeamName from "src/components/router/newTeam/name";
import NewTeamUrl from "src/components/router/newTeam/url";
import NewProduction from "src/components/router/production/newProduction";
import InvitePeople from "src/components/router/production/invitePeople";
import Tos from "src/components/router/auth/tos";
import CheckEmail from "src/components/router/auth/check-email";
import Directory from "src/components/router/production/directory";
import Crew from "src/components/router/production/directory/crew";
import Extras from "src/components/router/production/directory/extras";
import Cast from "src/components/router/production/directory/cast";
import TeamSoundDirectory from "src/components/router/team/directory/sounds";
import DigitalRequirements from "src/components/router/production/directory/digital";

const routes: Array<Route> = [
  {
    component: Router,
    exact: true,
    routes: [
      {
        path: "/",
        exact: true,
        // TODO: Create a backend route to verify a user is logged in and
        // inject the session as a cookie/cookies so we can render all static
        // content on the server instead of serving the user a white page.
        //
        // REF: PQ-1452 - https://rocksauce.atlassian.net/browse/PQ-1452
        //
        // Currently, the Router has a special case to detect when 1) the user is signed
        // in, 2) productions are loaded, 3) and user has hit this root route
        // to redirect to the first production drive or /invitations if there
        // are no productions
        component: () => null
        // component: Router
        // redirectTo: "/signin"
      },
      {
        path: "/signin",
        component: SignIn,
        exact: true
      },
      {
        path: "/signup",
        component: SignUp
      },
      {
        path: "/tos",
        component: Tos
      },
      {
        path: "/check-email",
        component: CheckEmail
      },
      {
        path: "/reset-password/email",
        component: Username
      },
      {
        path: "/reset-password/new-password",
        component: NewPassword
      },
      {
        path: "/reset-password/success",
        component: Success
      },
      {
        path: "/set-password",
        component: SetUpPassword
      },
      {
        path: "/invitations",
        component: Invitations
      },
      {
        path: "/new-team",
        component: NewTeam,
        routes: [
          {
            path: "/new-team/name",
            component: NewTeamName
          },
          {
            path: "/new-team/url",
            component: NewTeamUrl
          }
        ]
      },
      {
        path: "/teams/:teamId/directory/sounds",
        component: TeamSoundDirectory,
        routes: [
          {
            path: "/:teamId/directory/sounds/:soundCategory",
            component: TeamSoundDirectory
          }
        ]
      },
      {
        // TODO: move to /teams/:teamId/new-production
        path: "/:teamId/new-production",
        component: NewProduction
      },
      {
        path: "/:productionId",
        component: Production,
        routes: [
          {
            path: "/:productionId/drive",
            component: Drive,
            routes: [
              {
                path: "/:productionId/drive/:folderId?",
                component: Folder
              }
            ]
          },
          {
            path: "/:productionId/directory",
            component: Directory,
            routes: [
              {
                path: "/:productionId/directory/crew",
                component: Crew
              },
              {
                path: "/:productionId/directory/cast",
                component: Cast
              },
              {
                path: "/:productionId/directory/extras",
                component: Extras
              },
              {
                path: "/:productionId/directory/stuntskw",
                component: Crew // TODO
              },
              {
                path: "/:productionId/directory/digital/:categoryId",
                component: DigitalRequirements
              }
            ]
          },
          {
            path: "/:productionId/s/:screenplayId",
            component: Screenplay,
            routes: [
              {
                path: "/:productionId/s/:screenplayId/edit",
                component: Editor
              },
              {
                path: "/:productionId/s/:screenplayId/breakdown",
                component: Breakdown
              },
              {
                path: "/:productionId/s/:screenplayId/stripboard",
                component: Stripboard
              },
              {
                path: "/:productionId/s/:screenplayId/breakdown",
                component: Breakdown
              },
              {
                path: "/:productionId/s/:screenplayId/callsheet",
                component: CallSheet,
                routes: [
                  {
                    path: "/:productionId/s/:screenplayId/callsheet/schedule",
                    component: Schedule
                  },
                  {
                    path: "/:productionId/s/:screenplayId/callsheet/people",
                    component: People
                  },
                  {
                    path:
                      "/:productionId/s/:screenplayId/callsheet/requirements",
                    component: Requirements
                  }
                ]
              },
              {
                path: "/:productionId/s/:screenplayId/shots",
                component: Shots
              }
            ]
          },
          {
            path: "/:productionId/edit",
            component: ProductionDetails
          },
          {
            path: "/:productionId/users/profile",
            component: Profile
          },
          {
            path: "/:productionId/invite-people",
            component: InvitePeople
          }
        ]
      },
      {
        component: NotFound
      }
    ]
  }
];

export default routes;
