import styled from "@emotion/styled";

const ColorlibStepIconRoot = styled('div')(({ ownerState }: {
    ownerState: { completed: boolean, active: boolean }
}) => ({
    backgroundColor: '#FFF',
    color: '#FF8F00',
    ...((ownerState.active || ownerState.completed) && {
        backgroundColor: '#FF8F00',
        color: '#FFF',
    }),
    border: '1px solid #FF8F00',
    zIndex: 1,
    width: 24,
    height: 24,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    font: 'normal normal 600 12px/15px Inter'
}));

export default function InjiStepperIcon(props: any) {
    const { active, completed, className } = props;

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {props.icon}
        </ColorlibStepIconRoot>
    );
}
