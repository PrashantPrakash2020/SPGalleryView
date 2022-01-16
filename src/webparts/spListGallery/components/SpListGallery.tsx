import * as React from 'react';
import styles from './SpListGallery.module.scss';
import { ISpListGalleryProps, IAnnouncementItem, IJsonArray, IJsonMap } from './ISpListGalleryProps';
import { DataService } from './Code/codelogic'
import { boundMethod } from 'autobind-decorator';
import { SPHttpClientResponse } from '@microsoft/sp-http';
import * as $ from 'jquery';

export default class SpListGallery extends React.Component<ISpListGalleryProps, IAnnouncementItem> {
  private dataService: DataService;
  public constructor(props: ISpListGalleryProps) {
    super(props);
    this.dataService = new DataService(this.props.context);
    this.state = {
      title: '',
      accdescription: '',
      attachement: '',
      department: ''
    };
  }
  public componentDidMount(): void {
    this._getitems();
    this.enableExpandCollapse();
    this._setButtonEventHandlers();
  }
  public render(): React.ReactElement<ISpListGalleryProps> {

    return (
      <div className={styles.spListGallery}>
        <div className={styles.expandCollapse}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.justifyContentEnd}>
                <a href="#" id="linkExpandAll" style={{ display: 'none' }} onClick={() => { this.expandAll(); }}>Expand all</a>
                <a href="#" id="linkCollapseAll" rel="noreferrer" onClick={() => { this.collapseAll(); }}>Collapse all</a>
              </div>
              <div id="tblAnnouncementDetails">
              </div>

            </div>
          </div>
        </div>

      </div >

    );
  }

  @boundMethod
  private _getitems(): void {
    const announcementItems: IAnnouncementItem[] = [];
    const listname: string = 'TestList';
    const columns: string = 'Id,Title,Department,Description,AttachmentFiles';
    const expand: string = 'AttachmentFiles';
    this.dataService.getListItem('', listname, '', columns, expand, '', '')
      .then((response: SPHttpClientResponse) => {
        response.json().then((data: any) => {
          console.log(data);
          const alldept: string[] = [];
          let attachementlink: string = '';
          let id: string = '';
          let title: string = '';
          let department: string = '';
          const nextprojectData: IJsonArray = data.value as IJsonArray;
          nextprojectData.forEach((item: IJsonMap) => {
            department = item.Department as string;
            if (alldept.indexOf(department) === -1) {
              alldept.push(department);
            }
          });

          nextprojectData.forEach((item: IJsonMap) => {
            (item.AttachmentFiles as IJsonArray).forEach((file: IJsonMap) => {
              attachementlink = file.ServerRelativeUrl as string;
            });
            id = item.Id as string;
            title = item.Title as string;
            department = item.Department as string;

            announcementItems.push({ title: title, accdescription: title, department: department, attachement: attachementlink });
          });

          let html: string = "<div>";
          let innerpart: string = '';
          alldept.forEach((dept: any) => {
            innerpart = '';

            announcementItems.filter(aitems => aitems.department === dept).map((item: IAnnouncementItem) => {
              innerpart += `<div class="${styles.panel}">
                <div class="${styles.boxed}">
                <p><label>Title:</label><span> ${item.title}</span></p>
                <p><label>Department:</label><span> ${item.department}</span></p>
                <div><a href="${item.attachement}" download><img class="downicon" src="${require('../components/Assets/icon48.png')}" alt="download"></a></img></div>
              </div>
              </div>`;
            })
            html += `
            <div class="${styles.announcementItem}">
              <div class="${styles.titleRow}">
                <label>${dept}</label>
                <button type="button" class="${styles.buttonExpandCollapse} collapsible"}>▲</button>
              </div>
              <div class="${styles.descriptionRow}">
                    ${innerpart}
            </div></div>`;
          });

          html += '</div>';
          const announcementContainer: Element = document.querySelector('#tblAnnouncementDetails');
          announcementContainer.innerHTML = html;

        });
      })
  }


  private enableExpandCollapse() {
    const existCondition = setInterval(() => {
      if (document.getElementsByClassName("collapsible").length > 0) {
        const coll = document.getElementsByClassName("collapsible");

        for (let i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            const content = this.parentElement.nextElementSibling;
            if (content.style.display === "block" || content.style.display === "") {
              this.textContent = "▼";
              content.style.display = "none";
            } else {
              this.textContent = "▲";
              content.style.display = "block";
            }
          });
        }
        clearInterval(existCondition);
      }
    }, 100);
  }

  private _setButtonEventHandlers(): void {
    const webPart: SpListGallery = this;
    document.querySelector('#linkExpandAll').addEventListener('click', () => { webPart.expandAll(); });
    document.querySelector('#linkCollapseAll').addEventListener('click', () => { webPart.collapseAll(); });
  }

  private expandAll() {
    if (document.getElementsByClassName("collapsible").length > 0) {
      const coll = document.getElementsByClassName("collapsible");

      for (let i = 0; i < coll.length; i++) {
        const content: any = coll[i].parentElement.nextElementSibling;
        coll[i].textContent = "▲";
        content.style.display = "block";
      }
    }

    const linkCollapseAll = document.getElementById("linkCollapseAll");
    const linkExpandAll = document.getElementById("linkExpandAll");
    if (typeof linkCollapseAll !== "undefined" && typeof linkExpandAll !== "undefined") {
      linkCollapseAll.style.display = "block";
      linkExpandAll.style.display = "none";
    }
  }

  private collapseAll() {
    if (document.getElementsByClassName("collapsible").length > 0) {
      const coll = document.getElementsByClassName("collapsible");
      for (let i = 0; i < coll.length; i++) {
        const content: any = coll[i].parentElement.nextElementSibling;
        coll[i].textContent = "▼";
        content.style.display = "none";
      }
    }

    const linkCollapseAll = document.getElementById("linkCollapseAll");
    const linkExpandAll = document.getElementById("linkExpandAll");
    if (typeof linkCollapseAll !== "undefined" && typeof linkExpandAll !== "undefined") {
      linkCollapseAll.style.display = "none";
      linkExpandAll.style.display = "block";
    }
  }

}