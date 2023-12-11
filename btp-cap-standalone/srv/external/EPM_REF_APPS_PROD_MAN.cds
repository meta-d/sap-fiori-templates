/* checksum : 7d6b9f2636924e71d1c920c4da3f61b1 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service EPM_REF_APPS_PROD_MAN {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN.Suppliers {
  @sap.label : 'Supplier'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  key Id : String(10) not null;
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Supplier Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  Name : String(80) not null;
  @sap.label : 'Phone'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'tel;type=pref'
  Phone : String(30) not null;
  @sap.label : 'Email'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'email;type=pref'
  Email : String(255) not null;
  @sap.label : 'URI'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'url;type=work'
  WebAddress : LargeString not null;
  @sap.label : 'Address'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  FormattedAddress : String(129) not null;
  @sap.label : 'Contact Person Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  FormattedContactName : String(81) not null;
  @sap.label : 'Contact Person Tel'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'tel'
  ContactPhone1 : String(30) not null;
  @sap.label : 'Contact Person Fax'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'tel;type=fax'
  ContactPhone2 : String(30) not null;
  @sap.label : 'Contact Person Mail'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'email'
  ContactEmail : String(255) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.service.version : '1'
entity EPM_REF_APPS_PROD_MAN.Products {
  @sap.label : 'Product'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : String(10) not null;
  @sap.label : 'Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'currency-code'
  CurrencyCode : String(5) not null;
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  StockQuantity : Integer not null;
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Name : String(255) not null;
  @sap.label : 'Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Description : String(255) not null;
  @sap.label : 'Sub-Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SubCategoryId : String(40) not null;
  @sap.label : 'Sub-Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SubCategoryName : String(40) not null;
  @sap.label : 'Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryId : String(40) not null;
  @sap.label : 'Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryName : String(40) not null;
  @sap.label : 'Supplier'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SupplierId : String(10) not null;
  @sap.label : 'Supplier Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SupplierName : String(80) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @m.FC_TargetPath : 'SyndicationUpdated'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Last Changed'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastModified : Timestamp;
  @sap.unit : 'CurrencyCode'
  @sap.label : 'Price per Unit'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Price : Decimal(15, 2) not null;
  @sap.unit : 'QuantityUnit'
  @sap.label : 'Height'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DimensionHeight : Decimal(13, 3) not null;
  @sap.unit : 'QuantityUnit'
  @sap.label : 'Width'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DimensionWidth : Decimal(13, 3) not null;
  @sap.unit : 'QuantityUnit'
  @sap.label : 'Depth'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DimensionDepth : Decimal(13, 3) not null;
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DimensionUnit : String(10) not null;
  @sap.label : 'Image'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ImageUrl : String(255) not null;
  @sap.label : 'Base Unit'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'unit-of-measure'
  QuantityUnit : String(3) not null;
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MeasureUnit : String(10) not null;
  @sap.label : 'Average Rating'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  AverageRating : Decimal(4, 2) not null;
  @sap.label : 'Number of Reviews'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  RatingCount : Integer not null;
  @sap.unit : 'QuantityUnit'
  @sap.label : 'Weight'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  WeightMeasure : Decimal(13, 3) not null;
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  WeightUnit : String(10) not null;
  @cds.ambiguous : 'missing on condition?'
  Supplier : Association to EPM_REF_APPS_PROD_MAN.Suppliers on Supplier.Id = SupplierId;
} actions {
  action EditProduct() returns EPM_REF_APPS_PROD_MAN.ProductDrafts;
  action CopyProduct() returns EPM_REF_APPS_PROD_MAN.ProductDrafts;
};

@cds.external : true
@cds.persistence.skip : true
@sap.searchable : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN.ProductDrafts {
  @sap.label : 'Product'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : String(10) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @m.FC_TargetPath : 'SyndicationUpdated'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Last Changed'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastModified : Timestamp;
  @sap.label : 'TRUE'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsNewProduct : Boolean;
  @sap.label : 'TRUE'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsDirty : Boolean;
  @sap.label : 'Product'
  ProductId : String(10);
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Name'
  Name : String(255);
  @sap.label : 'Description'
  Description : String(255);
  @sap.label : 'Dimension Unit'
  @sap.semantics : 'unit-of-measure'
  DimensionUnit : String(3);
  @sap.unit : 'DimensionUnit'
  @sap.label : 'Height'
  DimensionHeight : Decimal(13, 3);
  @sap.unit : 'DimensionUnit'
  @sap.label : 'Width'
  DimensionWidth : Decimal(13, 3);
  @sap.unit : 'DimensionUnit'
  @sap.label : 'Depth'
  DimensionDepth : Decimal(13, 3);
  @sap.label : 'Weight Unit'
  @sap.semantics : 'unit-of-measure'
  WeightUnit : String(3);
  @sap.unit : 'WeightUnit'
  @sap.label : 'Weight'
  WeightMeasure : Decimal(13, 3);
  @sap.unit : 'CurrencyCode'
  @sap.label : 'Price'
  Price : Decimal(15, 2);
  @sap.label : 'Currency'
  @sap.semantics : 'currency-code'
  CurrencyCode : String(5);
  @sap.label : 'Base Unit'
  @sap.semantics : 'unit-of-measure'
  QuantityUnit : String(3);
  @sap.label : 'Image'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ImageUrl : String(255);
  @sap.label : 'Supplier'
  SupplierId : String(10);
  @sap.label : 'Supplier Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SupplierName : String(80);
  @sap.label : 'Sub-Category'
  SubCategoryId : String(40);
  @sap.label : 'Sub-Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SubCategoryName : String(40) not null;
  @sap.label : 'Category'
  MainCategoryId : String(40);
  @sap.label : 'Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryName : String(40) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @m.FC_TargetPath : 'SyndicationPublished'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Time Stamp'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedAt : Timestamp not null;
  @sap.label : 'Chgd by'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedBy : String(12) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.label : 'Time Stamp'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ExpiresAt : Timestamp;
  @cds.ambiguous : 'missing on condition?'
  Images : Association to many EPM_REF_APPS_PROD_MAN.ImageDrafts {  };
  @cds.ambiguous : 'missing on condition?'
  SubCategory : Association to EPM_REF_APPS_PROD_MAN.SubCategories on SubCategory.Id = SubCategoryId;
} actions {
  action ActivateProduct() returns EPM_REF_APPS_PROD_MAN.Products;
};

@cds.external : true
@cds.persistence.skip : true
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.deletable.path : 'IsDeletable'
@sap.updatable.path : 'IsModifiable'
entity EPM_REF_APPS_PROD_MAN.ImageDrafts {
  @sap.label : 'Node Key'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : UUID not null;
  @sap.label : 'Created by'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedBy : String(81) not null;
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Image File Name'
  FileName : String(255) not null;
  @sap.label : 'Is deletable'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsDeletable : Boolean not null;
  @sap.label : 'Is modifiable'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsModifiable : Boolean not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @m.FC_TargetPath : 'SyndicationUpdated'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Time Stamp'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastModified : Timestamp;
  @sap.label : 'Product ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ProductId : String(10) not null;
  @sap.label : 'Mime Type'
  @sap.updatable : 'false'
  MimeType : String(100) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @m.FC_TargetPath : 'SyndicationPublished'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Time Stamp'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedAt : Timestamp not null;
  @Core.MediaType : 'application/octet-stream'
  blob : LargeBinary;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN.MainCategories {
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : String(40) not null;
  @sap.label : 'Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Name : String(40) not null;
  @sap.label : 'Sub-Categories'
  @cds.ambiguous : 'missing on condition?'
  SubCategories : Association to many EPM_REF_APPS_PROD_MAN.SubCategories on SubCategories.MainCategoryId = Id;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN.SubCategories {
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Sub-Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : String(40) not null;
  @sap.label : 'Sub-Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Name : String(40) not null;
  @sap.label : 'Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryId : String(40) not null;
  @sap.label : 'Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryName : String(40) not null;
  @cds.ambiguous : 'missing on condition?'
  MainCategory : Association to EPM_REF_APPS_PROD_MAN.MainCategories on MainCategory.Id = MainCategoryId;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN.Currencies {
  @sap.label : 'ISO code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Code : String(3) not null;
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Text : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN.DimensionUnits {
  @sap.label : 'ISO code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Unit : String(3) not null;
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Shorttext : String(10) not null;
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Text : String(30) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN.QuantityUnits {
  @sap.label : 'ISO code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Unit : String(3) not null;
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Shorttext : String(10) not null;
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Text : String(30) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN.WeightUnits {
  @sap.label : 'ISO code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Unit : String(3) not null;
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Shorttext : String(10) not null;
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Text : String(30) not null;
};

