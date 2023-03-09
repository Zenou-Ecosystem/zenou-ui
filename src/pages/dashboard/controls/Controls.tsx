import { useEffect, useState } from "react";
import './controls.scss'
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import AddControl from "./AddControl";
import { HiPlus } from "react-icons/hi";
import useAppContext from "../../../hooks/useAppContext.hooks";
import ControlContextProvider, { ControlContext } from "../../../contexts/ControlContext";
import useControlContext from "../../../hooks/useControlContext";
import { ControlActionTypes } from "../../../store/action-types/control.actions";
import { IControl } from "../../../interfaces/controls.interface";
import { fetchControls } from "../../../services/control.service";

function Controls() {

    const [companies, setControls] = useState<IControl[]>([]);
    const [visible, setVisible] = useState(false);
    const { state, dispatch } = useAppContext();

    const { state: ControlState, dispatch: ControlDispatch } = useControlContext();

    const openAddControlForm = () => {
        setVisible(true);
    }

    useEffect(() => {
        (async () => {
            const res = await state;
            let data = res?.data;
            if (!data || data.length < 1) {
                data = await fetchControls();
            }
            setControls(data);
        })();

        (async () => {
            const resolvedControlState = await ControlState;
            if (resolvedControlState.hasCreated) {
                console.log('Control state changed => ', resolvedControlState);
                setVisible(false);
            }
        })();

    }, [state, ControlState]);


    const cardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Control Statistics'
    }
    const handleNameFilter = (query: string) => {
        console.log("The name typed is ", query);

    }
    const handleCountryFilter = (query: string) => {
        console.log("The country typed is ", query);

    }
    const handleCategoryFilter = (query: string) => {
        console.log("The category typed is ", query);

    }

    const handleCertificationFilter = (query: string) => {
        console.log("The certificate typed is ", query);

    }
    const filterProps = [{
        type: "text",
        onChange: handleNameFilter,
        placeholder: "Name"
    },
    {
        type: "text",
        onChange: handleCountryFilter,
        placeholder: "Country"
    }, {
        type: "text",
        onChange: handleCategoryFilter,
        placeholder: "Category"
    },
    {
        type: "text",
        onChange: handleCertificationFilter,
        placeholder: "Certification"
    }
    ];

    return (
        <ControlContextProvider>

            <div className="w-full px-4 my-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
            </div>

            <div className="w-full px-4">
                <BasicCard title=""
                    content={() => (
                        <>
                            <div className="filter my-4 w-11/12 m-auto flex items-center">
                                <div className="add-btn w-2/12">
                                    <Button title="New"
                                        styles="flex justify-around flex-row-reverse items-center rounded-full"
                                        onClick={openAddControlForm} Icon={{
                                            Name: HiPlus,
                                            classes: '',
                                            color: 'white'
                                        }} />
                                </div>
                                <div className="filter w-10/12">
                                    <Filter fields={filterProps} title='Filter Controls' />
                                </div>
                            </div>

                            <div className="add-form my-10">
                                <Dialog header="Register New Control" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                                    <AddControl />
                                </Dialog>
                            </div>

                            <Datatable
                                data={companies}
                                fields={['type', 'duration', 'department', 'theme', 'resources']}
                                actionTypes={ControlActionTypes}
                                context={ControlContext}
                            />
                        </>
                    )}
                    styles="p-0"
                />
            </div>
        </ControlContextProvider>
    );
}


export default Controls;