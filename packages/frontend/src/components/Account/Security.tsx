import React from 'react';
import { Button, Typography, Spin, PageHeader } from 'antd';
import { useMeQuery } from '../../queries';
import OnboardTOTP from './OnboardTOTP';
import DisableTOTP from './DisableTOTP';
import useBoolean from '../../utils/useBoolean';

function TOTPModal({
    visible,
    hasTOTP,
    onClose
}: {
    visible: boolean;
    hasTOTP: boolean;
    onClose(): void;
}) {
    if (hasTOTP) {
        return <DisableTOTP visible={visible} onClose={onClose} />;
    }
    return <OnboardTOTP visible={visible} onClose={onClose} />;
}

export default function Security() {
    const [totpModalVisible, { off, on }] = useBoolean(false);
    const { data, loading, refetch } = useMeQuery();

    if (loading || !data) {
        return <Spin />;
    }

    function onClose() {
        off();
        refetch();
    }

    return (
        <PageHeader title="Security" ghost={false}>
            <Button>Change Password</Button>
            <hr />
            <Typography.Text>
                Two factor auth <strong>{data.me.hasTOTP ? 'is' : 'is not'}</strong> enabled.
            </Typography.Text>
            <Button type={data.me.hasTOTP ? 'danger' : 'default'} onClick={on}>
                {data.me.hasTOTP ? 'Disable' : 'Enable'} Two-Factor Authentication
            </Button>
            <TOTPModal visible={totpModalVisible} hasTOTP={data.me.hasTOTP} onClose={onClose} />
        </PageHeader>
    );
}
