using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Inn = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "PipeTypes",
                columns: table => new
                {
                    IDType = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PipeTypes", x => x.IDType);
                });

            migrationBuilder.CreateTable(
                name: "Stocks",
                columns: table => new
                {
                    IDStock = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    StockName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stocks", x => x.IDStock);
                });

            migrationBuilder.CreateTable(
                name: "Nomenclatures",
                columns: table => new
                {
                    ID = table.Column<string>(type: "text", nullable: false),
                    IDCat = table.Column<string>(type: "text", nullable: false),
                    IDType = table.Column<string>(type: "text", nullable: false),
                    IDTypeNew = table.Column<string>(type: "text", nullable: false),
                    ProductionType = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Gost = table.Column<string>(type: "text", nullable: false),
                    FormOfLength = table.Column<string>(type: "text", nullable: false),
                    Manufacturer = table.Column<string>(type: "text", nullable: false),
                    SteelGrade = table.Column<string>(type: "text", nullable: false),
                    Diameter = table.Column<double>(type: "double precision", nullable: false),
                    PipeWallThickness = table.Column<double>(type: "double precision", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Koef = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nomenclatures", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Nomenclatures_PipeTypes_IDType",
                        column: x => x.IDType,
                        principalTable: "PipeTypes",
                        principalColumn: "IDType",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderID = table.Column<Guid>(type: "uuid", nullable: false),
                    NomenclatureID = table.Column<string>(type: "text", nullable: false),
                    StockID = table.Column<string>(type: "text", nullable: false),
                    QuantityInTons = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantityInMeters = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.ID);
                    table.ForeignKey(
                        name: "FK_OrderItems_Nomenclatures_NomenclatureID",
                        column: x => x.NomenclatureID,
                        principalTable: "Nomenclatures",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderID",
                        column: x => x.OrderID,
                        principalTable: "Orders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Stocks_StockID",
                        column: x => x.StockID,
                        principalTable: "Stocks",
                        principalColumn: "IDStock",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Prices",
                columns: table => new
                {
                    ID = table.Column<string>(type: "text", nullable: false),
                    IDStock = table.Column<string>(type: "text", nullable: false),
                    PriceT = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceLimitT1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceT1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceLimitT2 = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceT2 = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceM = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceLimitM1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceM1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceLimitM2 = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceM2 = table.Column<decimal>(type: "numeric", nullable: false),
                    NDS = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prices", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Prices_Nomenclatures_ID",
                        column: x => x.ID,
                        principalTable: "Nomenclatures",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Prices_Stocks_IDStock",
                        column: x => x.IDStock,
                        principalTable: "Stocks",
                        principalColumn: "IDStock",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Remnants",
                columns: table => new
                {
                    ID = table.Column<string>(type: "text", nullable: false),
                    IDStock = table.Column<string>(type: "text", nullable: false),
                    InStockT = table.Column<decimal>(type: "numeric", nullable: false),
                    InStockM = table.Column<decimal>(type: "numeric", nullable: false),
                    AvgTubeLength = table.Column<decimal>(type: "numeric", nullable: false),
                    AvgTubeWeight = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Remnants", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Remnants_Nomenclatures_ID",
                        column: x => x.ID,
                        principalTable: "Nomenclatures",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Remnants_Stocks_IDStock",
                        column: x => x.IDStock,
                        principalTable: "Stocks",
                        principalColumn: "IDStock",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Nomenclatures_IDType",
                table: "Nomenclatures",
                column: "IDType");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_NomenclatureID",
                table: "OrderItems",
                column: "NomenclatureID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderID",
                table: "OrderItems",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_StockID",
                table: "OrderItems",
                column: "StockID");

            migrationBuilder.CreateIndex(
                name: "IX_Prices_IDStock",
                table: "Prices",
                column: "IDStock");

            migrationBuilder.CreateIndex(
                name: "IX_Remnants_IDStock",
                table: "Remnants",
                column: "IDStock");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Prices");

            migrationBuilder.DropTable(
                name: "Remnants");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Nomenclatures");

            migrationBuilder.DropTable(
                name: "Stocks");

            migrationBuilder.DropTable(
                name: "PipeTypes");
        }
    }
}
