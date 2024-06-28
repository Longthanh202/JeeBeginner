import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'm-delete-entity-dialog',
  templateUrl: './delete-entity-dialog.component.html',
})
export class DeleteEntityDialogComponent implements OnInit {
  viewLoading: boolean = false;
  description: string;
  //yesText: string = 'Delete';
  constructor(public dialogRef: MatDialogRef<DeleteEntityDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    //if (this.data.doPositiveBtn)
    //this.yesText = this.data.doPositiveBtn;
    if (this.data.description) this.description = this.data.description;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      //phím Enter
      if (this.data.isDel == true) {
        this.onNoClick(); //if delete confirm, default is no
      } else {
        this.onYesClick();
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    /* Server loading imitation. Remove this */
    this.viewLoading = true;
    setTimeout(() => {
      this.dialogRef.close(true); // Keep only this row
    }, 0);
  }
}
