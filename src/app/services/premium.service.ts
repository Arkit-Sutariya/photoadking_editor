import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PremiumService {

  constructor() { }

  showPaymentDialog(data, callback, waitingCallback = function () { }, surveydata = '') {
    /* var premium_dialog_ref = this.modal.open(PremiumDialogComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'payment-dialog-modal-class',
      backdrop: 'static',
      // backdropClass: 'premium-backdrop-class',
      backdropClass: 'payment-dialog-backdrop-class',
      keyboard: false
    });
    data ? premium_dialog_ref.componentInstance.data = data : null;
    surveydata != '' ? premium_dialog_ref.componentInstance.surveydata = surveydata : null;

    // premium_dialog_ref.componentInstance.isFirstTime = isFirtTime;
    premium_dialog_ref.result.then(result => {
      if (result.code == 200) {
        result.message ? this.utils.showSuccess(result.message, true, 5000) : null;
        // PAYMENT IS SUCCESSFUL THEN CALL PASSED CALLBACK() FUNCTION;
        callback();
      }
      else if (result.code == 436) {
        waitingCallback();
      }
      else {
        // 201 : DIALOG IS CLOSED BY USER
        // 401 : PAYMENT IS FAILED
      }
    }) */
  }
}
