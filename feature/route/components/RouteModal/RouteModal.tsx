'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import styles from './RouteModal.module.css';
import { RouteData } from '../../types';
import { routeApi } from '../../api/routeApi';

interface RouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: RouteData | null;
    title: string;
}

interface SelectOption {
    value: number;
    label: string;
}

const RouteModal = ({ isOpen, onClose, onSubmit, initialData, title }: RouteModalProps) => {

    // Setup React Hook Form
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();

    const [locationOptions, setLocationOptions] = useState<SelectOption[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    // 1. Fetch danh sách địa điểm (Giữ nguyên, thêm log để debug)
    useEffect(() => {
        if (isOpen) {
            const fetchOptions = async () => {
                setIsLoadingOptions(true);
                try {
                    const locations = await routeApi.getLocations();

                    // Map và khử trùng lặp ID ngay từ đầu
                    const uniqueLocations = Array.from(
                        new Map(locations.map((item: any) => [item.locationId, item])).values()
                    );

                    const locOpts = uniqueLocations.map((loc: any) => ({
                        value: loc.locationId,
                        label: loc.locationName
                    }));

                    console.log("Loaded Options:", locOpts); // Kiểm tra xem danh sách có đúng không
                    setLocationOptions(locOpts);
                } catch (error) {
                    console.error("Failed to load options", error);
                } finally {
                    setIsLoadingOptions(false);
                }
            };
            fetchOptions();
        }
    }, [isOpen]);

    // 2. Điền dữ liệu vào Form (Logic tìm kiếm thông minh hơn)
    useEffect(() => {
        // Chỉ chạy khi Modal mở, options đã load xong, và có dữ liệu edit
        if (isOpen && locationOptions.length > 0 && initialData) {
            console.log("Editing Data:", initialData);

            // --- A. Điền Text/Number ---
            setValue('routeName', initialData.routeName);
            setValue('distance', initialData.distance);
            setValue('estimatedDuration', initialData.estimatedDuration);

            // --- B. Hàm Helper để tìm Option bất chấp hoa/thường/khoảng trắng ---
            const findOption = (nameToFind: string | undefined) => {
                if (!nameToFind) return null;

                // Chuẩn hóa: chữ thường + cắt khoảng trắng 2 đầu
                const normalizedSearch = nameToFind.toLowerCase().trim();

                return locationOptions.find(opt =>
                    opt.label.toLowerCase().trim() === normalizedSearch
                );
            };

            // --- C. Tìm Điểm Đi & Đến ---
            const originOpt = findOption(initialData.originName);
            const destOpt = findOption(initialData.destinationName);

            // Debug: Nếu không tìm thấy thì log ra để biết tại sao
            if (!originOpt) console.warn(`Không tìm thấy Origin: "${initialData.originName}" trong options`);
            if (!destOpt) console.warn(`Không tìm thấy Dest: "${initialData.destinationName}" trong options`);

            setValue('originId', originOpt || null);
            setValue('destinationId', destOpt || null);

            // --- D. Xử lý Điểm Dừng (Intermediate Stops) ---
            if (initialData.stopNames && Array.isArray(initialData.stopNames)) {
                // Map toàn bộ stopNames sang SelectOption
                const mappedStops = initialData.stopNames
                    .map(name => findOption(name))
                    .filter((item): item is SelectOption => !!item);

                // Khử trùng lặp (phòng BE gửi trùng)
                const uniqueStops = mappedStops.filter(
                    (stop, index, self) =>
                        index === self.findIndex(t => t.value === stop.value)
                );

                setValue('intermediateStopIds', uniqueStops);
            }

        } else if (isOpen && !initialData) {
            // Reset form khi Add New
            reset({
                routeName: '',
                distance: '',
                estimatedDuration: '',
                originId: null,
                destinationId: null,
                intermediateStopIds: []
            });
        }
    }, [isOpen, initialData, locationOptions, reset, setValue]);

    if (!isOpen) return null;

    // ... (Phần handleFormSubmit và return JSX giữ nguyên như cũ)
    const handleFormSubmit = (data: any) => {
        const payload = {
            routeName: data.routeName,
            distance: Number(data.distance),
            estimatedDuration: Number(data.estimatedDuration),
            originName: data.originId?.label,
            destinationName: data.destinationId?.label,
            intermediateStopNames: data.intermediateStopIds?.map((opt: SelectOption) => opt.label) || []
        };
        onSubmit(payload);
    };

    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: 'var(--input-bg)',
            color: 'var(--input-text)',
            borderRadius: '8px',
            borderColor: state.isFocused
                ? 'var(--primary)'
                : 'var(--border-gray)',
            boxShadow: state.isFocused
                ? '0 0 0 1px var(--primary)'
                : 'none',
            minHeight: '38px',
        }),

        placeholder: (base: any) => ({
            ...base,
            color: 'var(--text-gray)',
        }),

        singleValue: (base: any) => ({
            ...base,
            color: 'var(--input-text)',
        }),

        input: (base: any) => ({
            ...base,
            color: 'var(--input-text)',
        }),

        menu: (base: any) => ({
            ...base,
            backgroundColor: 'var(--input-bg)',
            color: 'var(--input-text)',
            zIndex: 9999,
        }),

        menuList: (base: any) => ({
            ...base,
            backgroundColor: 'var(--input-bg)',
        }),

        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected
                ? 'var(--primary)'
                : state.isFocused
                    ? 'var(--bg-hover)'
                    : 'transparent',
            color: state.isSelected
                ? 'var(--text-white)'
                : 'var(--input-text)',
            cursor: 'pointer',
        }),

        multiValue: (base: any) => ({
            ...base,
            backgroundColor: 'var(--badge-bg)',
            borderRadius: '4px',
        }),

        multiValueLabel: (base: any) => ({
            ...base,
            color: 'var(--badge-text)',
        }),

        multiValueRemove: (base: any) => ({
            ...base,
            color: 'var(--badge-text)',
            ':hover': {
                backgroundColor: 'var(--primary)',
                color: 'var(--text-white)',
            },
        }),
    };


    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles['close-button']} onClick={onClose} type="button">
                    <svg fill="none" viewBox="0 0 16 16"><path d="M12 4L4 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" /><path d="M4 4L12 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" /></svg>
                </button>

                <div className={styles['modal-header']}>
                    <h2 className={styles['modal-title']}>{title}</h2>
                </div>

                <form className={styles['form-content']} onSubmit={handleSubmit(handleFormSubmit)}>

                    {/* Route Name */}
                    <div className={styles['form-field']}>
                        <label className={styles['form-label']}>Route Name <span style={{ color: 'red' }}>*</span></label>
                        <input {...register('routeName', { required: true })} className={styles['form-input']} placeholder="Ex: HCM - Da Lat Express" />
                    </div>

                    {/* Origin & Dest */}
                    <div className={styles['form-row']}>
                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Start Point <span style={{ color: 'red' }}>*</span></label>
                            <Controller
                                name="originId"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select {...field} options={locationOptions} isLoading={isLoadingOptions} placeholder="Select origin..." styles={customStyles} />
                                )}
                            />
                        </div>
                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>End Point <span style={{ color: 'red' }}>*</span></label>
                            <Controller
                                name="destinationId"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select {...field} options={locationOptions} isLoading={isLoadingOptions} placeholder="Select destination..." styles={customStyles} />
                                )}
                            />
                        </div>
                    </div>

                    {/* Distance & Time */}
                    <div className={styles['form-row']}>
                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Distance (km)</label>
                            <input type="number" step="0.1" {...register('distance', { required: true })} className={styles['form-input']} />
                        </div>
                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Est. Time (mins)</label>
                            <input type="number" {...register('estimatedDuration', { required: true })} className={styles['form-input']} />
                        </div>
                    </div>

                    {/* Stops */}
                    <div className={styles['form-field']}>
                        <label className={styles['form-label']}>Intermediate Stops</label>
                        <Controller
                            name="intermediateStopIds"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti options={locationOptions} isLoading={isLoadingOptions} placeholder="Select stops..." styles={customStyles} closeMenuOnSelect={false} />
                            )}
                        />
                    </div>

                    <div className={styles['button-group']}>
                        <button type="button" className={`${styles.btn} ${styles['btn-cancel']}`} onClick={onClose}>Cancel</button>
                        <button type="submit" className={`${styles.btn} ${styles['btn-update']}`}>{initialData ? 'Update Route' : 'Save Route'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RouteModal;