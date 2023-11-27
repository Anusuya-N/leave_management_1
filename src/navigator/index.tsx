import * as React from "react";
import { DrawerActions, StackActions } from "@react-navigation/native";

export const navigationRef: any = React.createRef();

function navigate(name: string, params?: any) {
  navigationRef?.current?.navigate(name, params);
}

function openDrawer() {
  navigationRef?.current?.dispatch(DrawerActions.openDrawer());
}

function closeDrawer() {
  navigationRef?.current?.dispatch(DrawerActions.closeDrawer()); // Corrected action
}

function goBack() {
  navigationRef?.current?.goBack();
}

function push(name: string, params?: any) {
  navigationRef?.current?.dispatch(StackActions.push(name, params)); // You can import StackActions from @react-navigation/native
}

export const navigation = {
  navigate,
  openDrawer,
  closeDrawer,
  goBack,
  push
};
