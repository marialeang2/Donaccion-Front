import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../Pagination";

describe("Componente Pagination", () => {
  const setup = (props) => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        onPageChange={onPageChange}
        maxPages={props.maxPages || 5}
      />
    );
    return { onPageChange };
  };

  it("no se renderiza si totalPages <= 1", () => {
    render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("renderiza los botones de navegación correctamente", () => {
    setup({ currentPage: 3, totalPages: 10 });

    expect(screen.getByText("1")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText("3").closest("li")).toHaveClass("active");
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("llama a onPageChange al hacer clic en un número de página", () => {
    const { onPageChange } = setup({ currentPage: 2, totalPages: 5 });

    fireEvent.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('navega con los botones "First" y "Last"', () => {
    const { onPageChange } = setup({ currentPage: 3, totalPages: 5 });

    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.click(screen.getByText("«", { selector: "span" }).closest("a"));
    expect(onPageChange).toHaveBeenCalledWith(1);
    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.click(screen.getByText("»", { selector: "span" }).closest("a"));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('desactiva los botones "First" y "Prev" cuando currentPage = 1', () => {
    setup({ currentPage: 1, totalPages: 5 });
    // eslint-disable-next-line testing-library/no-node-access
    const first = screen.getByText("«", { selector: "span" }).closest("li");
    // eslint-disable-next-line testing-library/no-node-access
    const prev = screen.getByText("‹", { selector: "span" }).closest("li");

    expect(first).toHaveClass("disabled");
    expect(prev).toHaveClass("disabled");
  });

  it('desactiva los botones "Next" y "Last" cuando currentPage = totalPages', () => {
    setup({ currentPage: 5, totalPages: 5 });
    // eslint-disable-next-line testing-library/no-node-access
    const next = screen.getByText("›", { selector: "span" }).closest("li");
    // eslint-disable-next-line testing-library/no-node-access
    const last = screen.getByText("»", { selector: "span" }).closest("li");

    expect(next).toHaveClass("disabled");
    expect(last).toHaveClass("disabled");
  });
});
