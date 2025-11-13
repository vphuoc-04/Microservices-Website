import React, { JSX } from 'react';
import { Sheet } from '@/hooks/useSheet';

export interface BreadcrumbItem {
    title: string;
    route: string;
}

export interface PageTexts {
    title: string;
    description: string;
    desStyle?: string;
}

export interface BreadcrumbConfig {
    items: BreadcrumbItem[];
    page: PageTexts;
    create: PageTexts;
    update: PageTexts;
    view: PageTexts;
}

export interface TableColumn<T = any> {
    name: string;
    className?: string;
    render: (item: T) => JSX.Element;
}

export type Row = Record<string, any>;
export type OpenSheetFunction = (sheet: Sheet) => void;
export type ActionParam = keyof Row | `${string}:f` | `${string}:c`;

export type ParamToType<T extends ActionParam> =
    T extends `${string}:f` ? Function :
    T extends `${string}:c` ? React.ComponentType<any> :
    T extends keyof Row ? Row[T] : never;

export type ParamsToTuple<T extends ActionParam[]> = {
    [K in keyof T]: ParamToType<T[K]>;
}

export interface ButtonAction<T extends ActionParam[]> {
    onClick?: (...args: ParamsToTuple<T>) => void;
    params?: T;
    className?: string;
    icon?: React.ReactNode;
    path?: string;
    method?: string;
    component?: React.ComponentType<any>;
}

export interface BaseSettingConfig<T = any> {
    breadcrumb: BreadcrumbConfig;
    tableColumn: TableColumn<T>[];
    buttonActions: ButtonAction<ActionParam[]>[];
}