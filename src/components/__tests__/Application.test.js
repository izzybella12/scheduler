import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByPlaceholderText, getByAltText, prettyDOM, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const { container } = render(<Application />)

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    })
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument()

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application/>);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"))
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.

    expect(getByText(appointment, /delete the appointment/i)).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument()

    // 7. Wait until the element with the "Add" button is displayed.

    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // 1. Loads data
    const { container } = render(<Application/>);
    // Wait until Archie Cohen is there
    await waitForElement(() => getByText(container, "Archie Cohen"))

    // 2. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(getByAltText(appointment, "Edit"));

    // 3. Check that the confirmation message is shown.
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toBeInTheDocument();

    // 4. Change name 
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Isabella Panagrosso" }
    });

    // 5. Save the edit form 
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Expect to see Isabella Panagrosso in appointment

    await waitForElement(() => getByText(appointment, "Isabella Panagrosso"));

    // 7. Expect to see 1 spot remaining
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  })

  it("shows the save error when failing to save an appointment", async () => {

    axios.put.mockRejectedValueOnce();

    // 1. Loads data 
    const { container } = render(<Application />)

    // 2. Makes sure Archie Cohen is in the doc
    await waitForElement(() => getByText(container, "Archie Cohen"))

    // 3. Gets an ampty slot 
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0]

    // 4. Fires a click to add an appointment 
    fireEvent.click(getByAltText(appointment, "Add"));

    // 5. Input info to form 
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Isabella Panagrosso" }
    })
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Expect to see an error message 

    await waitForElement(() => getByText(appointment, /could not save appointment/i))

    // 7. Click on the cancel x on the 
    fireEvent.click(getByAltText(appointment, "Close"));

    // 8. Expect appointment to contain an add feature
    
    expect(getByAltText(appointment, "Add")).toBeInTheDocument()

    // 9. Expect one spot to still be remaining 
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  }),

  it("shows the delete error when failing to delete an appointment", async () => {

    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application/>);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"))

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, /delete the appointment/i)).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Expect to see an error message 
    await waitForElement(() => getByText(appointment, /could not delete appointment/i))

    // 7. Click on the cancel x on the 
    fireEvent.click(getByAltText(appointment, "Close"));

    // 8. Expect Archie Cohen to still be in appointment
    await waitForElement(() => getByText(appointment, "Archie Cohen"));

    // 9. Expect one spot to still be remaining 
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

})
