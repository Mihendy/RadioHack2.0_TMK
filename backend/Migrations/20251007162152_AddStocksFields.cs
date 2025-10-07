using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddStocksFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "CardPayment",
                table: "Stocks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CashPayment",
                table: "Stocks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ConsigneeCode",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FIASId",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IDDivision",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OwnerFullName",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OwnerInn",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OwnerKpp",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OwnerShortName",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RailwayStation",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Schedule",
                table: "Stocks",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "CardPayment",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "CashPayment",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "ConsigneeCode",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "FIASId",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "IDDivision",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "OwnerFullName",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "OwnerInn",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "OwnerKpp",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "OwnerShortName",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "RailwayStation",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "Schedule",
                table: "Stocks");
        }
    }
}
