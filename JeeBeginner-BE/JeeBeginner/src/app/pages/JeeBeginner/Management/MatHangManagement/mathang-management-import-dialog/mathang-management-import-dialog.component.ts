import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BehaviorSubject, of, ReplaySubject, Subscription } from "rxjs";
import { AuthService } from "src/app/modules/auth/_services/auth.service";
import {
  LayoutUtilsService,
  MessageType,
} from "../../../_core/utils/layout-utils.service";
import { ResultModel, ResultObjModel } from "../../../_core/models/_base.model";
import { DatePipe } from "@angular/common";
import { finalize, tap } from "rxjs/operators";
import { PaginatorState } from "src/app/_metronic/shared/crud-table";
import { MatHangManagementService } from "../Services/mathang-management.service";
import { MatHangModel } from "../Model/mathang-management.model";
import { TranslateService } from "@ngx-translate/core";
import { GeneralService } from "../../../_core/services/general.service";
import { QueryParamsModel } from "../../../_core/models/query-models/query-params.model";
@Component({
  selector: "app-mathang-management-edit-dialog",
  templateUrl: "./mathang-management-import-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatHangManagementImportDialogComponent
  implements OnInit, OnDestroy
{
  item: MatHangModel = new MatHangModel();
  itemkho: MatHangModel = new MatHangModel();
  isLoading;
  formGroup: FormGroup;
  khoFilters: MatHangModel[] = [];
  loaiMHFilters: MatHangModel[] = [];

  arrMatHang: any[] = [];
  XuatXuFilters: MatHangModel[] = [];
  XuatXuMHFilters: MatHangModel[] = [];
  selectedTab: number = 0;
  listIdLMH: any[] = [];
  selectIdLMH: string = "0";

  listIdDVT: any[] = [];

  selectIdDVT: string = "0";
  listIdDVTCap2: any[] = [];
  selectIdDVTCap2: string = "0";
  listIdDVTCap3: any[] = [];
  selectIdDVTCap3: string = "0";
  listIdNhanHieu: any[] = [];
  selectIdNhanHieu: string = "0";
  listIdXuatXu: any[] = [];
  selectIdXuatXu: string = "0";

  disBtnSubmit: boolean = false;

  private subscriptions: Subscription[] = [];
  KhofilterForm: FormControl;
  XuatXufilterForm: FormControl;
  selectedFile: File | null = null;
  loaiMHfilterForm: FormControl;
  isInitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MatHangManagementImportDialogComponent>,
    private fb: FormBuilder,
    public mathangManagementService: MatHangManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public general: GeneralService,
    public authService: AuthService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.item.empty();
    this.item.IdMH = this.data.item.IdMH;
    this.loadForm();
    const sb = this.mathangManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
    this.subscriptions.push(sb);
    //   const add = this.mathangManagementService
    //   .DM_Kho_List()
    //   .subscribe((res: ResultModel<MatHangModel>) => {
    //     if (res && res.status === 1) {
    //       this.khoFilters = res.data;
    //       this.KhofilterForm = new FormControl(this.khoFilters[0].IdKho);
    //       this.isInitData.next(true);
    //     }
    //   });
    // this.subscriptions.push(add);

    debugger;
    this.ListIdXuatXu();
    this.ListIdDVT();
    this.ListIdLMH();
    this.ListIdNhanHieu();
    this.ListIdDVTCap2();
    this.ListIdDVTCap3();
    this.loadInitDataUpdate();
  }
  loadInitData() {
    // if (this.itemkho.IdKho !== 0) {
    //   const sbGet = this.mathangManagementService
    //     .GetKhoID(this.itemkho.IdKho)
    //     .pipe(
    //       tap((res: ResultObjModel<MatHangModel>) => {
    //         if (res.status === 1) {
    //           this.itemkho = res.data;
    //           this.setValueToForm(res.data);
    //         }
    //       })
    //     )
    //     .subscribe();
    //   this.subscriptions.push(sbGet);
    // }
  }
  loadInitDataLoaiMHCHA() {
    if (this.item.SoKyTinhKhauHaoToiDa !== 0) {
      const sbGet = this.mathangManagementService
        .GetKhoID(this.item.SoKyTinhKhauHaoToiDa)
        .pipe(
          tap((res: ResultObjModel<MatHangModel>) => {
            if (res.status === 1) {
              this.item = res.data;
              this.setValueToForm(res.data);
            }
          })
        )
        .subscribe();
      this.subscriptions.push(sbGet);
    }
  }
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
  }

  loadInitDataUpdate() {
    debugger;
    if (this.item.IdMH !== 0) {
      const sbGet = this.mathangManagementService
        .gettaikhoanModelByRowID(this.item.IdMH)
        .pipe(
          tap((res: ResultObjModel<MatHangModel>) => {
            if (res.status === 1) {
              this.item = res.data;
              this.setValueToForm(res.data);
            }
          })
        )
        .subscribe();
      this.subscriptions.push(sbGet);
    }
  }
  loadForm() {
    this.formGroup = this.fb.group({
      maHang: [
        this.item.MaHang == null || this.item.MaHang == ""
          ? ""
          : this.item.MaHang,
        Validators.required,
      ],
      tenMatHang: [
        this.item.TenMatHang == null || this.item.TenMatHang == ""
          ? ""
          : this.item.TenMatHang,
        Validators.required,
      ],
      idLMH: [
        this.item.IdLMH == 0 ? "" : this.item.IdLMH.toString(),
        Validators.required,
      ],
      idDVT: [
        this.item.IdDVT == 0 ? "" : this.item.IdDVT.toString(),
        Validators.required,
      ],
      mota: [this.item.Mota == null ? "" : this.item.Mota],
      giaMua: [
        this.item.GiaMua == null
          ? "0"
          : this.f_currency_V2(this.item.GiaMua.toString()),
      ],
      giaBan: [
        this.item.GiaBan == null
          ? "0"
          : this.f_currency_V2(this.item.GiaBan.toString()),
      ],
      vAT: [this.item.VAT == null ? "0" : this.item.VAT.toString()],
      barcode: [this.item.Barcode == null ? "" : this.item.Barcode],
      ngungKinhDoanh: [
        this.item.NgungKinhDoanh == null ? "" : this.item.NgungKinhDoanh,
      ],
      idDVTCap2: [
        this.item.IdDVTCap2 == null ? "0" : this.item.IdDVTCap2.toString(),
      ],
      quyDoiDVTCap2: [
        this.item.QuyDoiDVTCap2 == null
          ? "0"
          : this.f_currency_V2(this.item.QuyDoiDVTCap2.toString()),
      ],
      idDVTCap3: [
        this.item.IdDVTCap3 == null ? "0" : this.item.IdDVTCap3.toString(),
      ],
      quyDoiDVTCap3: [
        this.item.QuyDoiDVTCap3 == null
          ? "0"
          : this.f_currency_V2(this.item.QuyDoiDVTCap3.toString()),
      ],
      tenOnSite: [
        this.item.TenOnSite == null || this.item.TenOnSite == ""
          ? ""
          : this.item.TenOnSite,
      ],
      idNhanHieu: [
        this.item.IdNhanHieu == null ? "0" : this.item.IdNhanHieu.toString(),
      ],
      idXuatXu: [
        this.item.IdXuatXu == null ? "0" : this.item.IdXuatXu.toString(),
      ],
      chiTietMoTa: [this.item.ChiTietMoTa == null ? "" : this.item.ChiTietMoTa],
      maPhu: [this.item.MaPhu == null ? "" : this.item.MaPhu],
      thongSo: [this.item.ThongSo == null ? "" : this.item.ThongSo],
      theoDoiTonKho: [
        this.item.TheoDoiTonKho == null ? "" : this.item.TheoDoiTonKho,
      ],
      theodoiLo: [this.item.TheodoiLo == null ? true : this.item.TheodoiLo],
      maLuuKho: [
        this.item.MaLuuKho == null ? "" : this.item.MaLuuKho.toString(),
      ],
      maViTriKho: [this.item.MaViTriKho == null ? "" : this.item.MaViTriKho],
      imageControl: [this.item.HinhAnh],
      lstImageControl: [this.item.lstImg],
      upperLimit: [
        this.item.UpperLimit == 0 || this.item.UpperLimit == null
          ? "0"
          : this.f_currency_V2("" + this.item.UpperLimit),
      ],
      lowerLimit: [
        this.item.LowerLimit == 0 || this.item.LowerLimit == null
          ? "0"
          : this.f_currency_V2("" + this.item.LowerLimit),
      ],
      isTaiSan: [this.item.IsTaiSan == null ? "" : this.item.IsTaiSan],

      SoKyTinhKhauHaoToiThieu: [
        this.item.SoKyTinhKhauHaoToiThieu == null
          ? "0"
          : this.f_currency_V2(this.item.SoKyTinhKhauHaoToiThieu.toString()),
        Validators.required,
      ],
      SoKyTinhKhauHaoToiDa: [
        this.item.SoKyTinhKhauHaoToiDa == null
          ? "0"
          : this.f_currency_V2(this.item.SoKyTinhKhauHaoToiDa.toString()),
        Validators.required,
      ],

      SoNamDeNghi: [
        this.item.SoNamDeNghi == null
          ? "0"
          : this.f_currency_V2(this.item.SoNamDeNghi.toString()),
        Validators.required,
      ],
      TiLeHaoMon: [
        this.item.TiLeHaoMon == null
          ? "0"
          : this.f_currency_V2(this.item.TiLeHaoMon.toString()),
        Validators.required,
      ],
    });
  }

  setValueToForm(model: MatHangModel) {
    debugger;
    this.formGroup.controls.maHang.setValue(model.MaHang);
    this.formGroup.controls.tenMatHang.setValue(model.TenMatHang);
    this.formGroup.controls.idLMH.setValue(model.IdLMH);
    this.formGroup.controls.idDVT.setValue(model.IdDVT);
    this.formGroup.controls.mota.setValue(model.Mota);
    this.formGroup.controls.giaMua.setValue(model.GiaMua);
    this.formGroup.controls.giaBan.setValue(model.GiaBan);
    this.formGroup.controls.vAT.setValue(model.VAT);
    this.formGroup.controls.barcode.setValue(model.Barcode);
    this.formGroup.controls.ngungKinhDoanh.setValue(model.NgungKinhDoanh);
    this.formGroup.controls.idDVTCap2.setValue(model.IdDVTCap2);
    this.formGroup.controls.quyDoiDVTCap2.setValue(model.QuyDoiDVTCap2);
    this.formGroup.controls.idDVTCap3.setValue(model.IdDVTCap3);
    this.formGroup.controls.quyDoiDVTCap3.setValue(model.QuyDoiDVTCap3);
    this.formGroup.controls.tenOnSite.setValue(model.TenOnSite);
    this.formGroup.controls.idNhanHieu.setValue(model.IdNhanHieu);
    this.formGroup.controls.idXuatXu.setValue(model.IdXuatXu);
    this.formGroup.controls.chiTietMoTa.setValue(model.ChiTietMoTa);
    this.formGroup.controls.maPhu.setValue(model.MaPhu);
    this.formGroup.controls.thongSo.setValue(model.ThongSo);
    this.formGroup.controls.theoDoiTonKho.setValue(model.TheoDoiTonKho);
    this.formGroup.controls.theodoiLo.setValue(model.TheodoiLo);
    this.formGroup.controls.isTaiSan.setValue(model.IsTaiSan);
    this.formGroup.controls.maLuuKho.setValue(model.MaLuuKho);
    this.formGroup.controls.maViTriKho.setValue(model.MaViTriKho);
    this.formGroup.controls.upperLimit.setValue(model.UpperLimit);
    this.formGroup.controls.lowerLimit.setValue(model.LowerLimit);
    this.formGroup.controls.SoKyTinhKhauHaoToiThieu.setValue(
      model.SoKyTinhKhauHaoToiThieu
    );
    this.formGroup.controls.SoKyTinhKhauHaoToiDa.setValue(
      model.SoKyTinhKhauHaoToiDa
    );
    this.formGroup.controls.SoNamDeNghi.setValue(model.SoNamDeNghi);
    this.formGroup.controls.TiLeHaoMon.setValue(model.TiLeHaoMon);
    //this.formGroup.controls.nhanhieucha.setValue(model.SoKyTinhKhauHaoToiDa);
    //this.formGroup.controls.kho.setValue(model.IdKho);
  }

  // getTitle() {
  //   if (this.item.RowId === 0) {
  //     return this.translateService.instant(
  //       "ACCOUNTROLEMANAGEMENT.TAOTAIKHOANSUDUNG"
  //     );
  //   }
  //   return (
  //     this.translateService.instant("ACCOUNTROLEMANAGEMENT.SUATAIKHOAN") +
  //     " " +
  //     this.data.item.Username
  //   );
  // }

  private prepareData(): MatHangModel {
    debugger;
    const controls = this.formGroup.controls;
    const _DM_MatHang = new MatHangModel();
    _DM_MatHang.empty();
    _DM_MatHang.MaHang = controls["maHang"].value;
    _DM_MatHang.TenMatHang = controls["tenMatHang"].value;
    _DM_MatHang.IdLMH = controls["idLMH"].value;
    _DM_MatHang.IdDVT = controls["idDVT"].value;
    _DM_MatHang.Mota = controls["mota"].value;
    _DM_MatHang.GiaMua = controls["giaMua"].value;
    _DM_MatHang.GiaBan = controls["giaBan"].value;
    _DM_MatHang.VAT = controls["vAT"].value;
    _DM_MatHang.Barcode = controls["barcode"].value;
    _DM_MatHang.NgungKinhDoanh = controls["ngungKinhDoanh"].value
      ? true
      : false;
    _DM_MatHang.IdDVTCap2 = controls["idDVTCap2"].value;
    _DM_MatHang.QuyDoiDVTCap2 = controls["quyDoiDVTCap2"].value;
    _DM_MatHang.IdDVTCap3 = controls["idDVTCap3"].value;
    _DM_MatHang.QuyDoiDVTCap3 = controls["quyDoiDVTCap3"].value;
    _DM_MatHang.TenOnSite = controls["tenOnSite"].value;
    _DM_MatHang.IdNhanHieu = controls["idNhanHieu"].value;
    _DM_MatHang.IdXuatXu = controls["idXuatXu"].value;
    _DM_MatHang.ChiTietMoTa = controls["chiTietMoTa"].value;
    _DM_MatHang.MaPhu = controls["maPhu"].value;
    _DM_MatHang.ThongSo = controls["thongSo"].value;
    _DM_MatHang.TheoDoiTonKho = controls["theoDoiTonKho"].value ? true : false;
    _DM_MatHang.TheodoiLo = controls["theodoiLo"].value ? true : false;
    _DM_MatHang.IsTaiSan = controls["isTaiSan"].value ? true : false;
    _DM_MatHang.MaLuuKho = controls["maLuuKho"].value;
    _DM_MatHang.MaViTriKho = controls["maViTriKho"].value;
    _DM_MatHang.UpperLimit = controls["upperLimit"].value;
    _DM_MatHang.LowerLimit = controls["lowerLimit"].value;
    _DM_MatHang.SoKyTinhKhauHaoToiThieu =
      controls["SoKyTinhKhauHaoToiThieu"].value;
    _DM_MatHang.SoKyTinhKhauHaoToiDa = controls["SoKyTinhKhauHaoToiDa"].value;

    _DM_MatHang.SoNamDeNghi = controls["SoNamDeNghi"].value;
    _DM_MatHang.TiLeHaoMon = controls["TiLeHaoMon"].value;
    // _DM_MatHang.HinhAnh = controls['image'].value;
    //model.Mobile = this.formGroup.controls.sodienthoai.value;
    //model.Note = this.formGroup.controls.ghichu.value;
    // model.PartnerId = this.item.PartnerId;
    // model.Password = this.formGroup.controls.password.value;
    // model.Username = this.formGroup.controls.username.value;
    return _DM_MatHang;
  }

  Luu() {
    debugger;
    const model = this.prepareData();
    this.item.IdMH === 0 ? this.create(model) : this.update(model);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  create(item: MatHangModel) {
    this.isLoadingSubmit$.next(true);
    if (this.authService.currentUserValue.IsMasterAccount)
      this.mathangManagementService.DM_MatHang_Insert(item).subscribe((res) => {
        this.isLoadingSubmit$.next(false);
        if (res && res.status === 1) {
          this.dialogRef.close(res);
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      });
  }

  update(item: MatHangModel) {
    debugger;
    this.isLoadingSubmit$.next(true);
    this.mathangManagementService.UpdateMatHang(item).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    });
  }

  goBack() {
    const _title = this.translateService.instant("CHECKPOPUP.TITLE");
    const _description = this.translateService.instant(
      "CHECKPOPUP.DESCRIPTION"
    );
    const _waitDesciption = this.translateService.instant(
      "CHECKPOPUP.WAITDESCRIPTION"
    );
    const popup = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    popup.afterClosed().subscribe((res) => {
      res ? this.dialogRef.close() : undefined;
    });
  }
  ListIdXuatXu() {
    const xuatxu = this.mathangManagementService
      .DM_XuatXu_List()
      .subscribe((res: ResultModel<MatHangModel>) => {
        if (res && res.status === 1) {
          this.listIdXuatXu = res.data;
          // this.XuatXufilterForm = new FormControl(this.XuatXuFilters[0].IdXuatXu);
          // this.isInitData.next(true);
          this.selectIdXuatXu = "" + this.listIdXuatXu[0].idXuatXu;
          this.changeDetectorRefs.detectChanges();
        }
      });
    this.subscriptions.push(xuatxu);
  }
  ListIdLMH() {
    const xuatxu = this.mathangManagementService
      .DM_LoaiMatHang_List()
      .subscribe((res: ResultModel<MatHangModel>) => {
        if (res && res.status === 1) {
          this.listIdLMH = res.data;
          // this.XuatXufilterForm = new FormControl(this.XuatXuFilters[0].IdXuatXu);
          // this.isInitData.next(true);
          this.selectIdLMH = "" + this.listIdLMH[0].idLMH;
          this.changeDetectorRefs.detectChanges();
        }
      });
    this.subscriptions.push(xuatxu);
  }
  ListIdNhanHieu() {
    const xuatxu = this.mathangManagementService
      .DM_NhanHieu_List()
      .subscribe((res: ResultModel<MatHangModel>) => {
        if (res && res.status === 1) {
          this.listIdNhanHieu = res.data;
          // this.XuatXufilterForm = new FormControl(this.XuatXuFilters[0].IdXuatXu);
          // this.isInitData.next(true);
          this.selectIdNhanHieu = "" + this.listIdNhanHieu[0].idNhanHieu;
          this.changeDetectorRefs.detectChanges();
        }
      });
    this.subscriptions.push(xuatxu);
  }
  ListIdDVTCap2() {
    const xuatxu = this.mathangManagementService
      .DM_DVT_List()
      .subscribe((res: ResultModel<MatHangModel>) => {
        if (res && res.status === 1) {
          this.listIdDVTCap2 = res.data;
          // this.XuatXufilterForm = new FormControl(this.XuatXuFilters[0].IdXuatXu);
          // this.isInitData.next(true);
          this.selectIdDVTCap2 = "" + this.listIdDVTCap2[0].idDVT;
          this.changeDetectorRefs.detectChanges();
        }
      });
    this.subscriptions.push(xuatxu);
  }
  ListIdDVTCap3() {
    const xuatxu = this.mathangManagementService
      .DM_DVT_List()
      .subscribe((res: ResultModel<MatHangModel>) => {
        if (res && res.status === 1) {
          this.listIdDVTCap3 = res.data;
          // this.XuatXufilterForm = new FormControl(this.XuatXuFilters[0].IdXuatXu);
          // this.isInitData.next(true);
          this.selectIdDVTCap3 = "" + this.listIdDVTCap3[0].idDVT;
          this.changeDetectorRefs.detectChanges();
        }
      });
    this.subscriptions.push(xuatxu);
  }
  ListIdDVT() {
    const xuatxu = this.mathangManagementService
      .DM_DVT_List()
      .subscribe((res: ResultModel<MatHangModel>) => {
        if (res && res.status === 1) {
          this.listIdDVT = res.data;
          // this.XuatXufilterForm = new FormControl(this.XuatXuFilters[0].IdXuatXu);
          // this.isInitData.next(true);
          this.selectIdDVT = "" + this.listIdDVT[0].idDVT;
          this.changeDetectorRefs.detectChanges();
        }
      });
    this.subscriptions.push(xuatxu);
  }
  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (this.item.IdMH === 0) {
      const empty = new MatHangModel();
      empty.empty();
      return this.general.isEqual(empty, model);
    }
    return this.general.isEqual(model, this.item);
  }

  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return (e.returnValue = ""); //for Chorme
    }
  }
  ValidateChangeNumberEvent(event: any) {
    if (event.target.value == null || event.target.value == "") {
      const message = "Không thể để trống dữ liệu";
      this.layoutUtilsService.showActionNotification(
        message,
        MessageType.Create,
        2000,
        true,
        false
      );
      return false;
    }
    var count = 0;
    for (let i = 0; i < event.target.value.length; i++) {
      if (event.target.value[i] == ".") {
        count += 1;
      }
    }
    var regex = /[a-zA-Z -!$%^&*()_+|~=`{}[:;<>?@#\]]/g;
    var found = event.target.value.match(regex);
    if (found != null) {
      const message = "Dữ liệu không gồm chữ hoặc kí tự đặc biệt";
      this.layoutUtilsService.showActionNotification(
        message,
        MessageType.Create,
        2000,
        true,
        false
      );
      return false;
    }
    if (count >= 2) {
      const message = "Dữ liệu không thể có nhiều hơn 2 dấu .";
      this.layoutUtilsService.showActionNotification(
        message,
        MessageType.Create,
        2000,
        true,
        false
      );
      return false;
    }
    return true;
  }
  f_currency_V2(value: string): any {
    if (value == "-1") return "";
    if (value == null || value == undefined || value == "") value = "0";
    let nbr = Number((value + "").replace(/,/g, ""));
    return (nbr + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  changeValueOfForm(controlName: string, event: any) {
    if (controlName == "upperLimit") {
      let lower = this.formGroup.controls["lowerLimit"].value.replace(/,/g, "");
      let upper = this.formGroup.controls[controlName].value.replace(/,/g, "");
      if (+upper < +lower)
        this.formGroup.controls[controlName].setValue(
          this.f_currency_V2(lower)
        );
    }
    if (this.ValidateChangeNumberEvent(event)) {
      let tmpValue = this.formGroup.controls[controlName].value.replace(
        /,/g,
        ""
      );
      this.formGroup.controls[controlName].setValue(
        this.f_currency_V2(tmpValue)
      );
    }
  }
  isExistBarcode(event) {
    var arrMH = [
      ...this.arrMatHang.filter(
        (x) =>
          x.Barcode.toLowerCase() == event.target.value.trim().toLowerCase()
      ),
    ];
    if (arrMH.length > 0) {
      const message = `Barcode đã tồn tại`;
      this.layoutUtilsService.showActionNotification(
        message,
        MessageType.Create,
        2000,
        true,
        false
      );
      this.disBtnSubmit = true;
    } else {
      this.disBtnSubmit = false;
    }
  }
  isExistMaHang(event) {
    var arrMH = [
      ...this.arrMatHang.filter(
        (x) => x.MaHang.toLowerCase() == event.target.value.trim().toLowerCase()
      ),
    ];
    if (arrMH.length > 0) {
      const message = `Mã mặt hàng đã tồn tại`;
      this.layoutUtilsService.showActionNotification(
        message,
        MessageType.Create,
        2000,
        true,
        false
      );
      this.disBtnSubmit = true;
    } else {
      this.disBtnSubmit = false;
    }
  }

  ChangeSoNamDeNghi(event: any) {
    if (event.target.value == null || event.target.value == "") {
      return;
    }
    this.formGroup.controls["TiLeHaoMon"].setValue(
      this.f_currency_V2((event.target.value / 100).toString())
    );
    this.changeDetectorRefs.detectChanges();
  }
  async someMethod(value) {
    if (value) {
      var res = await this.mathangManagementService.GetKhoID(value).toPromise();
      if (res && res.status == 1) {
        this.formGroup.controls["maLuuKho"].setValue(res.data.IdKho);

        //this.changeDetectorRefs.detectChanges();
      }
    }
  }

  downloadTemplate(): void {
    this.mathangManagementService.exportToExcel().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mat-hang-mau.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  // importData(): void {
  //   if (this.selectedFile) {
  //     this.doitacbaohiemManagementService.importData(this.selectedFile).subscribe(
  //       response => {
  //         console.log('Data imported successfully!', response);
  //         // Thông báo thành công hoặc thực hiện các xử lý khác nếu cần
  //       },
  //       error => {
  //         console.error('Error while importing data:', error);
  //         // Xử lý lỗi nếu có
  //       }
  //     );
  //   }
  // }

  import(): void {
    debugger;
    this.isLoadingSubmit$.next(true);
    if (this.authService.currentUserValue.IsMasterAccount)
      this.mathangManagementService
        .importData(this.selectedFile)
        .subscribe((res) => {
          this.isLoadingSubmit$.next(false);
          if (res && res.status === 1) {
            this.dialogRef.close(res);
          } else {
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              999999999,
              true,
              false,
              3000,
              "top",
              0
            );
          }
        });
  }

  onFileChange(event: any): void {
    //const file = event.target.files[0];
    this.selectedFile = event.target.files[0] as File;
  }

  fileInput() {}
}
