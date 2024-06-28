import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ActionNotificationComponent } from '../../_shared/action-natification/action-notification.component';


import { DeleteEntityDialogComponent } from '../../_shared/delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from '../../_shared/fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from '../../_shared/update-status-dialog/update-status-dialog.component';


export enum MessageType {
	Create,
	Read,
	Update,
	Delete
}

@Injectable()
export class LayoutUtilsService {
	constructor(private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private translate: TranslateService
	) { }

	// SnackBar for notifications
	showActionNotification(
		message: string,
		type: MessageType = MessageType.Create,
		duration: number = 100000,
		showCloseButton: boolean = true,
		showUndoButton: boolean = false,
		undoButtonDuration: number = 3000,
		verticalPosition: 'top' | 'bottom' = 'top',
		mean: 0 | 1 = 1
	) {
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: duration,
			data: {
				message,
				snackBar: this.snackBar,
				showCloseButton: showCloseButton,
				showUndoButton: showUndoButton,
				undoButtonDuration,
				verticalPosition,
				type,
				action: 'Undo',
				meanMes: mean
			},
			verticalPosition: verticalPosition
		});
	}
	showInfo(
		message: string,
	) {
		let type: MessageType = MessageType.Create,
			duration: number = 100000,
			showCloseButton: boolean = true,
			showUndoButton: boolean = false,
			undoButtonDuration: number = 3000,
			verticalPosition: 'top' | 'bottom' = 'top',
			mean: 0 | 1 = 1
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: duration,
			data: {
				message,
				snackBar: this.snackBar,
				showCloseButton: showCloseButton,
				showUndoButton: showUndoButton,
				undoButtonDuration,
				verticalPosition,
				type,
				action: 'Undo',
				meanMes: mean
			},
			verticalPosition: verticalPosition
		});
	}

	showError(
		message: string,
	) {
		let type: MessageType = MessageType.Read,
			duration: number = 100000,
			showCloseButton: boolean = true,
			showUndoButton: boolean = false,
			undoButtonDuration: number = 3000,
			verticalPosition: 'top' | 'bottom' = 'top',
			mean: 0 | 1 = 1
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: duration,
			data: {
				message,
				snackBar: this.snackBar,
				showCloseButton: showCloseButton,
				showUndoButton: showUndoButton,
				undoButtonDuration,
				verticalPosition,
				type,
				action: 'Undo',
				meanMes: mean
			},
			verticalPosition: verticalPosition
		});
	}
	// Method returns instance of MatDialog
	deleteElement(title: string = '', description: string = '', waitDesciption: string = '', doPositiveBtn: string = 'Delete') {
		return this.dialog.open(DeleteEntityDialogComponent, {
			data: { title, description, waitDesciption, doPositiveBtn },
			width: '440px',
			panelClass: 'no-padding'
		});
	}

	// Method returns instance of MatDialog
	fetchElements(_data) {
		return this.dialog.open(FetchEntityDialogComponent, {
			data: _data,
			width: '400px'
		});
	}

	// Method returns instance of MatDialog
	updateStatusForCustomers(title, statuses, messages) {
		return this.dialog.open(UpdateStatusDialogComponent, {
			data: { title, statuses, messages },
			width: '480px'
		});
	}

	showWaitingDiv() {
		let v_idWaiting: string = 'nemo-process-waiting-id';//id waiting
		let v_idWaitingLoader: string = 'nemo-process-waiting-loader';//id waiting
		let _show: string = 'nemo-show-wait';
		let _hide: string = 'nemo-hide-wait';
		let divWait = document.getElementById(v_idWaiting);
		let loader = document.getElementById(v_idWaitingLoader);

		if (divWait.classList.contains(_show)) {
			divWait.classList.remove(_show);
			divWait.classList.add(_hide);

			loader.classList.remove(_show);
			loader.classList.add(_hide);
		}
		else {
			if (divWait.classList.contains(_hide)) {
				divWait.classList.remove(_hide);
				divWait.classList.add(_show);

				loader.classList.remove(_hide);
				loader.classList.add(_show);
			}
			else {
				divWait.classList.remove(_show);
				divWait.classList.add(_hide);

				loader.classList.remove(_show);
				loader.classList.add(_hide);
			}
		}
	}

	OffWaitingDiv() {
		let v_idWaiting: string = 'nemo-process-waiting-id';//id waiting
		let v_idWaitingLoader: string = 'nemo-process-waiting-loader';//id waiting
		let _show: string = 'nemo-show-wait';
		let _hide: string = 'nemo-hide-wait';
		let divWait = document.getElementById(v_idWaiting);
		let loader = document.getElementById(v_idWaitingLoader);

		divWait.classList.remove(_show);
		divWait.classList.add(_hide);

		loader.classList.remove(_show);
		loader.classList.add(_hide);

	}
	setUpPaginationLabels(pagination: MatPaginator) {
		var trongso = this.translate.instant('notify.trongtongso');
		pagination._intl.firstPageLabel = this.translate.instant('filter.trangdau');
		pagination._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
			if (length == 0 || pageSize == 0) { return `0 ${trongso} ${length}`; }

			length = Math.max(length, 0);

			const startIndex = page * pageSize;

			// If the start index exceeds the list length, do not try and fix the end index to the end.
			const endIndex = startIndex < length ?
				Math.min(startIndex + pageSize, length) :
				startIndex + pageSize;

			return `${startIndex + 1} - ${endIndex} ${trongso} ${length}`;
		};
		pagination._intl.itemsPerPageLabel = this.translate.instant('notify.sodongtrentrang')
		pagination._intl.lastPageLabel = this.translate.instant('filter.trangcuoi');
		pagination._intl.nextPageLabel = this.translate.instant('filter.trangke');
		pagination._intl.previousPageLabel = this.translate.instant('filter.trangtruoc');
	}
}
