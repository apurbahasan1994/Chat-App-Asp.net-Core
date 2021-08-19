import { Injectable } from "@angular/core";
import * as alertify from 'alertifyjs';
export class AlrtifyService {
  constructor() { }
  confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, function (e) {
      if (e) {
        okCallback();
      } else { }
    });
  }
  success(message) {
    alertify.success(message);
  }
  Error(message: string) {
    alertify.error(message);
  }
  warning() {
    alertify.warning("warning");
  }
  message() {
    alertify.message(("message"))
  }
}
