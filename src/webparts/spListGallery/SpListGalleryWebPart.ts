import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpListGalleryWebPartStrings';
import SpListGallery from './components/SpListGallery';
import { ISpListGalleryProps } from './components/ISpListGalleryProps';

export interface ISpListGalleryWebPartProps {
  description: string;
}

export default class SpListGalleryWebPart extends BaseClientSideWebPart<ISpListGalleryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISpListGalleryProps > = React.createElement(
      SpListGallery,
      {
        description: this.properties.description,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
