// Angular
import { Injectable } from '@angular/core';
// RxJS
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { MenuServices } from './menu.service';

@Injectable()
export class MenuConfigService {
  // Public properties
  onConfigUpdated$: Subject<any>;
  // Private properties
  private menuConfig: any;

  /**
   * Service Constructor
   */
  constructor(private menuPhanQuyenServices: MenuServices, private translate: TranslateService) {
    // register on config changed event and set default config
    this.onConfigUpdated$ = new Subject();
  }

  /**
   * Returns the menuConfig
   */
  async getMenus() {
    //lấy menu phân quyền
    let res = await this.layMenu().then();
    let menu;
    menu = this.fs_Assign(res.data);

    return menu;
  }

  layMenu() {
    return this.menuPhanQuyenServices.layMenuChucNang().toPromise();
  }

  fs_Assign(dt: any) {
    let config = {
      header: {
        self: {},
        items: [],
      },
      aside: {
        self: {},
        items: [],
      },
    };
    // let arr = [];
    dt.forEach((item, index) => {
      if (item.Child.length > 0) {
        const title = 'MAINMENU.' + item.Title;
        let _module = {
          title: this.translate.instant(title),
          root: item.Child ? item.Child.length > 0 : true,
          icon: '' + item.Icon,
          svg: '' + item.Icon,
          page: '' + item.ALink,
        };
        if (item.Child.length > 0) {
          _module['bullet'] = 'dot';
          _module['submenu'] = [];
          item.Child.forEach((itemE, indexE) => {
            let _mainmenu = {
              title: '' + itemE.Summary,
              page: '' + itemE.ALink,
            };
            _module['submenu'].push(_mainmenu);
          });
        }
        config.aside.items.push(_module);
      } else {
        const title = 'MAINMENU.' + item.Title;
        let _module = {
          title: this.translate.instant(title),
          root: item.Child ? item.Child.length == 0 : true,
          page: '' + item.ALink,
          svg: '' + item.Icon,
        };
        config.aside.items.push(_module);
      }
    });
    return config;
  }
  // async GetHCRolesToLocalStorage() {
  // 	let res = await this.menuPhanQuyenServices.HCRoles().toPromise().then();
  // 	/* Check Role */
  // 	if (res.length == 0) {
  // 		alert('Bạn chưa có quyền trong hệ thống !');
  // 		window.location.href = environment.RootWeb;
  // 	}
  // 	/*------------*/
  // 	localStorage.setItem('HC_Roles', JSON.stringify(res));
  // }

  /**
   * Load config
   *
   * @param config: any
   */
  loadConfigs(config: any) {
    this.menuConfig = config;
    this.onConfigUpdated$.next(this.menuConfig);
  }
}
