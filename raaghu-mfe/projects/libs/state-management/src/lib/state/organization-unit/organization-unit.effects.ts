import { Injectable } from '@angular/core';
import { AlertService, ServiceProxy } from '@libs/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  addRolesToOrganizationUnit, addUsersToOrganizationUnit, createTreeUnit, createTreeUnitFailure, createTreeUnitSuccess,
  deleteMemberFromOrgUnit,
  deleteMemberFromOrgUnitFailure,
  deleteMemberFromOrgUnitSuccess,
  deleteRoleFromOrgUnit,
  deleteRoleFromOrgUnitFailure,
  deleteRoleFromOrgUnitSuccess,
  deleteUnitTree, deleteUnitTreeFailure, deleteUnitTreeSuccess, getOrganizationUnitMembers, getOrganizationUnitMembersSuccess, getOrganizationUnitRoles,
  getOrganizationUnitRolesFailure, getOrganizationUnitRolesList, getOrganizationUnitRolesListFailure, getOrganizationUnitRolesListSuccess,
  getOrganizationUnitRolesSuccess, getOrganizationUnitTree, getOrganizationUnitTreeFailure, getOrganizationUnitTreeSuccess,
  getOrganizationUnitUsersList, getOrganizationUnitUsersListFailure, getOrganizationUnitUsersListSuccess, updateUnitTree,
  updateUnitTreeFailure, updateUnitTreeSuccess
} from './organization-unit.actions';

declare var bootstrap: any;
@Injectable()
export class OrganizationUnitEffects {
  constructor(
    private actions$: Actions,
    private organizationUnitService: ServiceProxy,
    private alertService: AlertService,
    private store: Store
  ) { }
  getOrganizationUnitTree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrganizationUnitTree),
      switchMap(() =>
        // Call the getTodos method, convert it to an observable
        from(this.organizationUnitService.all2()).pipe(
          // Take the returned value and return a new success action containing the todos
          map((organizationUnitTree) => {
            return getOrganizationUnitTreeSuccess({
              organizationUnitTree
            });
          }),
          // Or... if it errors return a new failure action containing the error
          catchError((error) => of(getOrganizationUnitTreeFailure({ error })))
        )
      )
    )
  );
  getOrganizationUnitMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrganizationUnitMembers),
      switchMap((data) =>
        // Call the getTodos method, convert it to an observable
        from(this.organizationUnitService.membersGET(data.id,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined, 0, 1000)).pipe(
          // Take the returned value and return a new success action containing the todos
          map((organizationUnitMembers) => {
            return getOrganizationUnitMembersSuccess({
              organizationUnitMembers
            });
          }),
          // Or... if it errors return a new failure action containing the error
          catchError((error) => of(getOrganizationUnitTreeFailure({ error })))
        )
      )
    )
  );
  getOrganizationUnitRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrganizationUnitRoles),
      switchMap((data) =>
        // Call the getTodos method, convert it to an observable
        from(this.organizationUnitService.rolesGET(data.id, 0, 1000, undefined)).pipe(
          // Take the returned value and return a new success action containing the todos
          map((organizationUnitRoles) => {
            return getOrganizationUnitRolesSuccess({
              organizationUnitRoles
            });
          }),
          // Or... if it errors return a new failure action containing the error
          catchError((error) => of(getOrganizationUnitRolesFailure({ error })))
        )
      )
    )
  );

  getOrganizationUnitUsersList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrganizationUnitUsersList),
      switchMap((input) =>
        from(this.organizationUnitService.usersGET2(undefined,undefined,undefined,undefined,undefined,undefined, undefined, undefined, undefined,0,1000)).pipe(
          map((organizationUnitUsersList) => {
            return getOrganizationUnitUsersListSuccess({
              organizationUnitUsersList
            });
          }),
          catchError((error) => of(getOrganizationUnitUsersListFailure({ error })))
        )
      )
    )
  );

  getOrganizationUnitRolesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrganizationUnitRolesList),
      switchMap((input) =>
        from(this.organizationUnitService.rolesGET3(undefined,undefined,0,1000)).pipe(
          map((organizationUnitRolesList) => {
            return getOrganizationUnitRolesListSuccess({
              organizationUnitRolesList
            });
          }),
          catchError((error) => of(getOrganizationUnitRolesListFailure({ error })))
        )
      )
    )
  );

  createTreeUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTreeUnit),
      mergeMap((data) =>
        this.organizationUnitService.organizationUnitsPOST(data).pipe(map((res) => {
          this.store.dispatch(getOrganizationUnitTree());
          this.alertService.showAlert('Success', 'Organization unit node created successfully', 'success');
          var offcanvasEl = document.getElementById('addNodeOffcanvas');
          var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl)
          offcanvas.hide();
        }),
          catchError((error: any) => of(
          ))
        )
      )
    ),
    {
      dispatch: false
    }
  );

  updateUnitTree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUnitTree),
      mergeMap((data) =>
        this.organizationUnitService.organizationUnitsPUT(data.id,data.body).pipe(
          map((res) => {
            this.store.dispatch(getOrganizationUnitTree());
            var offcanvasEl = document.getElementById('addNodeOffcanvas');
            var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl)
            offcanvas.hide();
            this.alertService.showAlert('Success', 'Organization unit node updated successfully', 'success')
          }),
          catchError((error: any) => of(
          ))
        )
      )
    ),
    {
      dispatch: false
    }
  );

  deleteUnitTree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUnitTree),
      mergeMap((data) =>
      this.organizationUnitService.organizationUnitsDELETE(data.id).pipe(map((res: any) => {
        this.store.dispatch(getOrganizationUnitTree());
          this.alertService.showAlert('Success', 'Organization unit node deleted successfully','success' )
        }),
          catchError((error: any) => of(
          ))
        )
      )
    ),
    {
      dispatch: false
    }
  );

  addRolesToOrganizationUnit$ = createEffect(() =>
  this.actions$.pipe(
    ofType(addRolesToOrganizationUnit),
    mergeMap((data) =>
      this.organizationUnitService.rolesPUT(data.id,data.body).pipe(map((res: any) => {
        this.store.dispatch(getOrganizationUnitRoles(data.id));
        this.alertService.showAlert('Success', 'Role added successfully', 'success');
      }),
        catchError((error: any) => of(
        ))
      )
    )
  ),
  {
    dispatch: false
  }
);

addUsersToOrganizationUnit$ = createEffect(() =>
this.actions$.pipe(
  ofType(addUsersToOrganizationUnit),
  mergeMap((data) =>
    this.organizationUnitService.membersPUT(data.id, data.body).pipe(map((res: any) => {
      this.store.dispatch(getOrganizationUnitMembers(data.id));
      this.alertService.showAlert('Success', 'Member added successfully', 'success');

        }),
          catchError((error: any) => of(
          ))
        )
      )
    ),
    {
      dispatch: false
    }
  );

// deleteMemberFromOrgUnit$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(deleteMemberFromOrgUnit),
//       mergeMap((data) =>
//         this.organizationUnitService.removeUserFromOrganizationUnit(data.userId,data.organizationUnitId).pipe(
//           // Take the returned value and return a new success action containing the todos
//           map(() => {
//             this.store.dispatch(getOrganizationUnitMembers(data.organizationUnitId));
//             this.store.dispatch(getOrganizationUnitTree());
//             this.alertService.showAlert('Success', 'Member Deleted successfully', 'success');
//           }),
//           catchError((error: any) => of(
//             ))
//           )
//         )
//       ),
//       {
//         dispatch: false
//       }
//   );
//   deleteRoleFromOrgUnit$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(deleteRoleFromOrgUnit),
//       mergeMap((data) =>
//         this.organizationUnitService.removeRoleFromOrganizationUnit(data.roleId,data.organizationUnitId).pipe(
//           map(() => {
//             this.store.dispatch(getOrganizationUnitRoles(data.organizationUnitId));
//             this.alertService.showAlert('Success', 'Role deleted successfully', 'success');
//           }),
//           catchError((error: any) => of(
//             ))
//           )
//         )
//       ),
//       {
//         dispatch: false
//       }
//   );
}