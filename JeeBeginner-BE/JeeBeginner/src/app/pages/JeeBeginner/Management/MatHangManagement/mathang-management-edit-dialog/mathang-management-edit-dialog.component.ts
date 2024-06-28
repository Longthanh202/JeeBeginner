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
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { DecimalPipe } from "@angular/common";
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
import { ElementRef, ViewChild } from "@angular/core";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-mathang-management-edit-dialog",
  templateUrl: "./mathang-management-edit-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatHangManagementEditDialogComponent implements OnInit, OnDestroy {
  item: MatHangModel = new MatHangModel();
  itemkho: MatHangModel = new MatHangModel();
  isLoading;
  formGroup: FormGroup;
  khoFilters: MatHangModel[] = [];
  loaiMHFilters: MatHangModel[] = [];

  isValid: boolean = true;
  errorMessage: string = "";
  selectedImageUrl: string = "";
  isValidBarcode: boolean = true;
  errorMessagearcode: string = "";
  file: File;
  errorMessageMH: string = "";
  isValidMH: boolean = true;

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
  loaiMHfilterForm: FormControl;
  isInitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @ViewChild("fileInput") fileInput: ElementRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MatHangManagementEditDialogComponent>,
    private fb: FormBuilder,
    public mathangManagementService: MatHangManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public general: GeneralService,
    public authService: AuthService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translate: TranslateService,
    private translateService: TranslateService,
    private changeDetectorRefs: ChangeDetectorRef //private decimalPipe: DecimalPipe
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  check: any;
  ngOnInit(): void {
    this.item.empty();
    this.item.IdMH = this.data.item.IdMH;
    this.loadForm();
    const sb = this.mathangManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
    this.subscriptions.push(sb);

    this.ListIdXuatXu();
    this.ListIdDVT();
    this.ListIdLMH();
    this.ListIdNhanHieu();
    this.ListIdDVTCap2();
    this.ListIdDVTCap3();
    this.loadInitDataUpdate();
    this.check = this.item.IdMH ? false : true;
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

  loadInitDataUpdate() {
    if (this.item.IdMH !== 0) {
      const sbGet = this.mathangManagementService
        .GetKhoID(this.item.IdMH)
        .pipe(
          tap((res: ResultObjModel<MatHangModel>) => {
            if (res.status === 1) {
              this.src = res.data.HinhAnh;
              this.item = res.data;
              this.setValueToForm(res.data);
            }
          })
        )
        .subscribe();
      this.subscriptions.push(sbGet);
    }
  }
  onChooseFile(): void {
    this.fileInput.nativeElement.click();
  }
  validateVAT(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value === "") {
      return { IsEmpty: "VAT <b>không được để trống.</b>" };
    }
    if ((isNaN(value) && value.indexOf(",") === -1) || parseFloat(value) < 0) {
      return { IsNaN: "VAT <b>phải là một số không âm.</b>" };
    }

    return null;
  }
  validateGiaMua(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value === "") {
      return { IsEmpty: "Giá mua <b>không được để trống.</b>" };
    }
    if ((isNaN(value) && value.indexOf(".") === -1) || parseFloat(value) < 0) {
      return { IsNaN: "Giá mua <b>phải là một số không âm.</b>" };
    }
    return null;
  }
  validateGiaBan(control: FormControl): ValidationErrors | null {
    const value = control.value;

    if (value === "") {
      return { IsEmpty: "Giá bán <b>không được để trống.</b>" };
    }
    if ((isNaN(value) && value.indexOf(".") === -1) || parseFloat(value) < 0) {
      return { IsNaN: "Giá bán <b>phải là một số không âm.</b>" };
    }
  }
  validateKTToiThieu(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value === "") {
      return {
        IsEmpty: "Số kỳ tính khấu hao tối thiểu <b>không được để trống.</b>",
      };
    }
    if ((isNaN(value) && value.indexOf(".") === -1) || parseFloat(value) < 0) {
      return {
        IsNaN: "Số kỳ tính khấu hao tối thiểu <b>phải là một số không âm.</b>",
      };
    }
    return null;
  }
  validateKTToiDa(control: FormControl): ValidationErrors | null {
    const value = control.value;

    if (value === "") {
      return {
        IsEmpty: "Số kỳ tính khấu hao tối đa <b>không được để trống.</b>",
      };
    }
    if ((isNaN(value) && value.indexOf(".") === -1) || parseFloat(value) < 0) {
      return {
        IsNaN: "Số kỳ tính khấu hao tối đa <b>phải là một số không âm.</b>",
      };
    }
  }
  validateDMToiThieu(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value === "") {
      return { IsEmpty: "Định mức tồn tối thiểu <b>không được để trống.</b>" };
    }
    if ((isNaN(value) && value.indexOf(".") === -1) || parseFloat(value) < 0) {
      return {
        IsNaN: "Định mức tồn tối thiểu <b>phải là một số không âm.</b>",
      };
    }
    return null;
  }
  validateDMToiDa(control: FormControl): ValidationErrors | null {
    const value = control.value;

    if (value === "") {
      return { IsEmpty: "Định mức tồn tối đa <b>không được để trống.</b>" };
    }
    if ((isNaN(value) && value.indexOf(".") === -1) || parseFloat(value) < 0) {
      return { IsNaN: "Định mức tồn tối đa <b>phải là một số không âm.</b>" };
    }
  }
  validateQDDVTC2(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value === "") {
      return {
        IsEmpty: "Quy đổi đơn vị tính cấp 2 <b>không được để trống.</b>",
      };
    }
    if ((isNaN(value) && value.indexOf(".") === -1) || parseFloat(value) < 0) {
      return {
        IsNaN: "Quy đổi đơn vị tính cấp 2 <b>phải là một số không âm.</b>",
      };
    }
    return null;
  }
  validateQDDVTC3(control: FormControl): ValidationErrors | null {
    const value = control.value;

    if (value === "") {
      return {
        IsEmpty: "Quy đổi đơn vị tính cấp 3 <b>không được để trống.</b>",
      };
    }
    if ((isNaN(value) && value.indexOf(".") === -1) || parseFloat(value) < 0) {
      return {
        IsNaN: "Quy đổi đơn vị tính cấp 3 <b>phải là một số không âm.</b>",
      };
    }
  }
  onChangenumber(value: string, controlName: string): void {
    const numericValue = parseFloat(
      value.replace(/,/g, "").replace(/\.(?=\d+)/g, "")
    );
    if (!isNaN(numericValue)) {
      value = numericValue.toLocaleString("vi-VN");
      this.formGroup.get(controlName).setValue(value, { emitEvent: false });
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
      idLMH: [this.item.IdLMH == null ? "0" : this.item.IdLMH.toString()],
      idDVT: [this.item.IdDVT == null ? "0" : this.item.IdDVT.toString()],
      mota: [this.item.Mota == null ? "" : this.item.Mota],

      giaMua: [
        this.item.GiaMua == null ? "0" : this.item.GiaMua,
        this.validateGiaMua,
      ],
      giaBan: [
        this.item.GiaBan == null ? "0" : this.item.GiaBan,
        this.validateGiaBan,
      ],
      vAT: [this.item.VAT == null ? "0" : this.item.VAT, this.validateVAT],
      barcode: [this.item.Barcode == null ? "" : this.item.Barcode],
      ngungKinhDoanh: [
        this.item.NgungKinhDoanh == null ? "" : this.item.NgungKinhDoanh,
      ],
      idDVTCap2: [
        this.item.IdDVTCap2 == null ? "0" : this.item.IdDVTCap2.toString(),
      ],
      quyDoiDVTCap2: [
        this.item.QuyDoiDVTCap2 == null ? "0" : this.item.QuyDoiDVTCap2,
        this.validateQDDVTC2,
      ],

      idDVTCap3: [
        this.item.IdDVTCap3 == null ? "0" : this.item.IdDVTCap3.toString(),
      ],
      quyDoiDVTCap3: [
        this.item.QuyDoiDVTCap3 == null ? "0" : this.item.QuyDoiDVTCap3,
        this.validateQDDVTC3,
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
        this.item.UpperLimit == null ? "0" : this.item.UpperLimit,
        this.validateDMToiDa,
      ],
      lowerLimit: [
        this.item.LowerLimit == null ? "0" : this.item.LowerLimit,
        this.validateDMToiThieu,
      ],

      isTaiSan: [this.item.IsTaiSan == null ? "" : this.item.IsTaiSan],
      SoKyTinhKhauHaoToiThieu: [
        this.item.SoKyTinhKhauHaoToiThieu == null
          ? "0"
          : this.item.SoKyTinhKhauHaoToiThieu,
        this.validateKTToiThieu,
      ],
      SoKyTinhKhauHaoToiDa: [
        this.item.SoKyTinhKhauHaoToiDa == null
          ? "0"
          : this.item.SoKyTinhKhauHaoToiDa,
        this.validateKTToiDa,
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
    this.formGroup.controls.mota.setValue(model.Mota);
    this.formGroup.controls.chiTietMoTa.setValue(model.ChiTietMoTa);
    this.formGroup.controls.idLMH.setValue("" + model.IdLMH);
    this.formGroup.controls.idDVT.setValue("" + model.IdDVT);
    this.formGroup.controls.idNhanHieu.setValue("" + model.IdNhanHieu);
    this.formGroup.controls.idXuatXu.setValue("" + model.IdXuatXu);
    this.formGroup.controls.SoKyTinhKhauHaoToiDa.setValue(
      model.SoKyTinhKhauHaoToiDa.toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
      })
    );
    this.formGroup.controls.SoKyTinhKhauHaoToiThieu.setValue(
      model.SoKyTinhKhauHaoToiThieu.toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
      })
    );
    this.formGroup.controls.tenOnSite.setValue(model.TenOnSite);
    this.formGroup.controls.vAT.setValue(model.VAT.toLocaleString("vi-VN"));
    this.formGroup.controls.giaMua.setValue(
      model.GiaMua.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
    );
    this.formGroup.controls.giaBan.setValue(
      model.GiaBan.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
    );
    this.formGroup.controls.lowerLimit.setValue(
      model.LowerLimit.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
    );
    this.formGroup.controls.upperLimit.setValue(
      model.UpperLimit.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
    );
    this.formGroup.controls.idDVTCap2.setValue("" + model.IdDVTCap2);
    this.formGroup.controls.quyDoiDVTCap2.setValue(
      model.QuyDoiDVTCap2.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
    );
    this.formGroup.controls.idDVTCap3.setValue("" + model.IdDVTCap3);
    this.formGroup.controls.quyDoiDVTCap3.setValue(
      model.QuyDoiDVTCap3.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
    );
    this.formGroup.controls.theodoiLo.setValue(model.TheodoiLo);
    this.formGroup.controls.isTaiSan.setValue(model.IsTaiSan);
    this.formGroup.controls.maPhu.setValue(model.MaPhu);
    this.formGroup.controls.thongSo.setValue(model.ThongSo);
    this.formGroup.controls.barcode.setValue(model.Barcode);
    this.selectedImageUrl = this.getImageUrl(model.HinhAnh);
  }

  handleKeyDown(event: KeyboardEvent) {
    // Kiểm tra nếu cả Ctrl và Enter đều được nhấn cùng lúc
    if (event.ctrlKey && event.key === "Enter") {
      // Gọi hàm lưu và đóng modal
      this.Luu();
      // Ngăn chặn hành vi mặc định của trình duyệt
      event.preventDefault();
    }
  }

  getTitle() {
    if (this.item.IdMH === 0) {
      return this.translateService.instant("Thêm mới");
    }
    return this.translateService.instant("Chỉnh sửa");
  }

  savecontinute() {
    debugger;
    const model = this.prepareData();
    this.item.IdMH === 0
      ? this.create1(model, "saveAndContinue")
      : this.update(model);
  }

  resetForm() {
    this.formGroup.reset();

    Object.keys(this.formGroup.controls).forEach((key) => {
      this.formGroup.get(key).setErrors(null);
    });
    this.setValueToForm(this.item);
  }

  resetData() {
    this.resetForm();
  }

  private prepareData(): MatHangModel {
    let model = new MatHangModel();
    model.empty();
    debugger;
    model.IdMH = this.item.IdMH;
    model.MaHang = this.formGroup.controls.maHang.value;
    model.TenMatHang = this.formGroup.controls.tenMatHang.value;
    model.Mota = this.formGroup.controls.mota.value;
    model.ChiTietMoTa = this.formGroup.controls.chiTietMoTa.value;
    model.IdLMH = this.formGroup.controls.idLMH.value;
    model.IdDVT = this.formGroup.controls.idDVT.value;
    model.IdNhanHieu = this.formGroup.controls.idNhanHieu.value;
    model.IdXuatXu = this.formGroup.controls.idXuatXu.value;
    model.SoKyTinhKhauHaoToiDa = parseInt(
      this.formGroup.controls.SoKyTinhKhauHaoToiDa.value
        .toString()
        .replace(/\./g, "")
    );
    model.SoKyTinhKhauHaoToiThieu = parseInt(
      this.formGroup.controls.SoKyTinhKhauHaoToiThieu.value
        .toString()
        .replace(/\./g, "")
    );
    model.TenOnSite = this.formGroup.controls.tenOnSite.value;
    model.VAT = parseFloat(
      this.formGroup.controls.vAT.value.toString().replace(/,/g, ".")
    );
    model.GiaMua = parseInt(
      this.formGroup.controls.giaMua.value.toString().replace(/\./g, "")
    );
    model.GiaBan = parseInt(
      this.formGroup.controls.giaBan.value.toString().replace(/\./g, "")
    );
    model.LowerLimit = parseInt(
      this.formGroup.controls.lowerLimit.value.toString().replace(/\./g, "")
    );
    model.UpperLimit = parseInt(
      this.formGroup.controls.upperLimit.value.toString().replace(/\./g, "")
    );
    model.IdDVTCap2 = this.formGroup.controls.idDVTCap2.value;
    model.QuyDoiDVTCap2 = parseInt(
      this.formGroup.controls.quyDoiDVTCap2.value.toString().replace(/\./g, "")
    );
    model.IdDVTCap3 = this.formGroup.controls.idDVTCap3.value;
    model.QuyDoiDVTCap3 = parseInt(
      this.formGroup.controls.quyDoiDVTCap3.value.toString().replace(/\./g, "")
    );
    model.TheodoiLo = this.formGroup.controls.theodoiLo.value;
    model.IsTaiSan = this.formGroup.controls.isTaiSan.value;
    model.MaPhu = this.formGroup.controls.maPhu.value;
    model.Barcode = this.formGroup.controls.barcode.value;
    model.ThongSo = this.formGroup.controls.thongSo.value;
    model.HinhAnh = this.item.HinhAnh;

    return model;
  }
  onChangeNumberFloat(event: any) {
    const newValue = event.target.value.replace(/[^\d,]/g, "");
    let countComma = (newValue.match(/,/g) || []).length;
    let kq1 = newValue;
    if (countComma > 1) {
      kq1 = newValue.replace(/,/g, (match, offset) =>
        offset === newValue.indexOf(",") ? match : ""
      );
    }
    const kq2 = kq1.replace(/^0+(?=\d)/, "");
    const [phandau, phanthapphan] = kq2.split(",");
    let kq3 = kq2;
    if (parseFloat(phandau) >= 100) kq3 = kq2.replace(kq2, 100);
    this.formGroup.get("vAT").setValue(kq3);
  }
  async onFileSelected(event: any) {
    debugger;

    this.file = event.target.files[0];

    if (this.file) {
      this.item.HinhAnh = this.file.name;
      try {
        this.selectedImageUrl = this.getImageUrl(this.file.name);
        this.mathangManagementService.uploadImage(this.file);
      } catch {
        console.log("Error Upload File");
      }
    }
  }
  getImageUrl(imageName: string): string {
    debugger;
    return `${environment.ApiUrlRoot}/uploads/${imageName}`;
  }
  Luu() {
    if (this.formGroup.valid) {
      const model = this.prepareData();
      this.item.IdMH === 0 ? this.create(model) : this.update(model);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
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
    if (
      this.authService.currentUserValue.IsMasterAccount ||
      !this.authService.currentUserValue.IsMasterAccount
    )
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

  create1(item: MatHangModel, actionType: string) {
    this.isLoadingSubmit$.next(true);
    if (
      this.authService.currentUserValue.IsMasterAccount ||
      !this.authService.currentUserValue.IsMasterAccount
    )
      this.mathangManagementService.DM_MatHang_Insert(item).subscribe((res) => {
        this.isLoadingSubmit$.next(false);
        if (res && res.status === 1) {
          if (actionType === "saveAndContinue") {
            this.dialogRef.close(res);

            const item = new MatHangModel();
            item.empty();
            let saveMessageTranslateParam = "";
            saveMessageTranslateParam += "Thêm thành công";
            const saveMessage = this.translate.instant(
              saveMessageTranslateParam
            );
            const messageType = MessageType.Create;
            const dialogRef = this.dialog.open(
              MatHangManagementEditDialogComponent,
              {
                data: { item: item },
                width: "900px",
                disableClose: true,
              }
            );
            dialogRef.afterClosed().subscribe((res) => {
              if (!res) {
                this.mathangManagementService.fetch();
              } else {
                this.layoutUtilsService.showActionNotification(
                  saveMessage,
                  messageType,
                  4000,
                  true,
                  false
                );
                this.mathangManagementService.fetch();
              }
            });
          } else {
            this.dialogRef.close(res);
          }
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
      this.errorMessage = "Không thể để trống dữ liệu";
      this.isValid = false;
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
      this.errorMessage = "Dữ liệu không gồm chữ hoặc kí tự đặc biệt";
      this.isValid = false;
      return false;
    }
    if (count >= 2) {
      this.errorMessage = "Dữ liệu không thể có nhiều hơn 2 dấu .";
      this.isValid = false;
      return false;
    }
    this.isValid = true;
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
      this.errorMessage = `Barcode đã tồn tại`;
      this.isValid = false;
      this.disBtnSubmit = true;
    } else {
      this.disBtnSubmit = false;
      this.isValid = true;
    }
  }
  isExistMaHang(event) {
    var arrMH = [
      ...this.arrMatHang.filter(
        (x) => x.MaHang.toLowerCase() == event.target.value.trim().toLowerCase()
      ),
    ];
    if (arrMH.length > 0) {
      this.errorMessageMH = `Mã mặt hàng đã tồn tại`;
      this.isValidMH = false;
      this.disBtnSubmit = true;
    } else {
      this.disBtnSubmit = false;
      this.isValidMH = true;
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
        this.changeDetectorRefs.detectChanges();
      }
    }
  }
  src: string;
}
