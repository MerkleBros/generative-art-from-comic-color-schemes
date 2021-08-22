#!/usr/bin/env python
"""
Functions for k-means color clustering on images
"""

from os import listdir
from pathlib import Path
from typing import List, Tuple
import json
import numpy as np
import matplotlib.pyplot as plt
import cv2
from sklearn.cluster import KMeans
from kneed import KneeLocator

IMAGES_DIRECTORY = "../../data/images/"
PLOTS_DIRECTORY = "../../data/plots"
SAVED_COLOR_CLUSTERS_FILE = "../../data/colors.json"


def load_image(path):
    """Load an image using OpenCV

    :path: String path to the image on disk
    :returns: 2D matrix (numpy.ndarray from cv.Mat) of pixels in the image

    """
    image_bgr = cv2.imread(path)
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    image = image_rgb.reshape((image_rgb.shape[1] * image_rgb.shape[0], 3))
    return image


def fit_k_means(data, number_of_clusters):
    """Perform k-means clustering and return the k-means object

    :data: array-like data for k-means clustering
    :number_of_clusters: Number of centroids to fit to data
    :returns: KMeans object from sklearn.cluster.KMeans with clustered data

    """
    k_means = KMeans(n_clusters=number_of_clusters)
    k_means.fit(data)

    return k_means


def fit_k_means_for_range(data, start: int, stop: int) -> list:
    """Perform k_means clustering for a range of cluster values

    :data: array-like data for k-means clustering
    :start: starting value for range (int)
    :stop: ending value for range (int)
    :returns: List of tuples of (fitted k_means object, number of clusters)
        of type [(sklearn.cluster.KMeans, int)]

    """
    k_means = []
    for i in range(start, stop + 1):
        k_means.append((fit_k_means(data, i), i))
    return k_means


def get_numbers_of_clusters_and_inertias(
    k_means_list: list,
) -> Tuple[List[int], List[int]]:
    """Return tuple of ([numbers of clusters], [k-means fitted inertias])

    :k_means_list: List of tuples of (fitted k_means object, number of clusters):
        [(sklearn.cluster.KMeans, int)]
    :returns: Tuple of (numbers of clusters, inertias)

    """
    x = []
    y = []
    for k_means, number_of_clusters in k_means_list:
        x.append(number_of_clusters)
        y.append(k_means.inertia_)
    return (x, y)


def save_k_means_json(
    k_means: List, image_path: Path, file_path: Path = Path("../../data/colors.json")
):
    """Save all fitted color clusters for an image to a json file
    The JSON schema in file_path should be as below where
    image_name is the relative path to the image file
    number_of_clusters is a String integer ("1", "2", etc)
    color_one, color_two, etc are dict of fitted color cluster values

    {
        image_name:
            number_of_clusters: [
                {"r": 123, "g": 456, "b": 789},
                ...
           ]
    }

    :k_means: List of tuples of (fitted k_means object, number of clusters)
        of type [(sklearn.cluster.KMeans, int)]
    :image_path: Path object to image file
    :file_path: Path object to output JSON file


    :returns: None

    """

    if not image_path.exists():
        print("save_k_means_json: image_path does not exist")
        return

    file_data = {}
    cluster_data = {}
    for touple in k_means:
        number_of_clusters = touple[1]
        centroid_ndarray = touple[0].cluster_centers_
        centroid_flat_array = []
        for array in centroid_ndarray:
            d = {"red": array[0], "green": array[1], "blue": array[2]}
            centroid_flat_array.append(d)

        cluster_data[number_of_clusters] = centroid_flat_array

    try:
        if file_path.exists():
            with open(str(file_path), "r") as json_file:
                file_data = json.load(json_file)
    except:
        print(f"save_k_means_json: error loading json from {file_path}")
        print(f"did not save json data for {image_path}")
        return

    file_data[str(image_path)] = cluster_data

    with open(str(file_path), "w") as json_file:
        json.dump(file_data, json_file, indent=4, sort_keys=True)


def get_knee_point(
    x: List[int], y: List[int], sensitivity: float, curvature: str, slope: str
) -> int:
    """Find the knee point for y vs x

    :x: List of numeric x values
    :y: List of numeric y values
    :sensitivity: sensitivity parameter for kneed
    :curvature: one of "convex" or "concave"
    :slope: one of "increasing" or "decreasing"
    :returns: The x value where the knee point is located

    """
    kneedle = KneeLocator(x, y, S=sensitivity, curve=curvature, direction=slope)
    return kneedle.elbow


def plot_line_chart(x: List[int], y: List[int], file_name):
    """Save a line chart
    :x: Plot x values [int]
    :y: Plot y values [int]
    :file_name: Path to save line chart str

    """
    plt.plot(x, y)
    plt.savefig(file_name)


def plot_k_means_pie_chart(k_means, file_name):
    """Take a k_means object and save a pie chart of color clusters to disk

    :k_means: A fitted KMeans object from sklearn.cluster.KMeans
    :file_name: File name of the pie chart str
    :returns: None

    """

    # Each pixel in the image is labeled with which centroid it belongs to
    labeled_pixels = list(k_means.labels_)
    centroids = k_means.cluster_centers_

    centroid_percentages = []
    for index, centroid in enumerate(centroids):
        centroid_pixel_count = labeled_pixels.count(index)
        centroid_percentage = centroid_pixel_count / len(labeled_pixels)
        centroid_percentages.append(centroid_percentage)

    plt.pie(
        centroid_percentages,
        colors=np.array(centroids / 255),
        labels=np.arange(len(centroid_percentages)),
    )
    plt.savefig(file_name)
    plt.clf()


def main(directory, plot_directory, saved_color_clusters_file):
    """Color cluster images with k-means and persist centroid pie charts

    :directory: str Directory containing images to be processed
    :plot_directory: str Directory to save plots (without trailing /)
    :saved_color_clusters_file: str relative path to JSON file containing
     data for images that have already been processed
    :returns: None

    """

    json_dict = {}
    try:
        if Path(saved_color_clusters_file).exists():
            with open(saved_color_clusters_file, "r") as json_file:
                json_dict = json.load(json_file)
                print("found json colors file")
    except:
        print(f"error opening {saved_color_clusters_file}")

    paths = listdir(directory)
    for path in paths:
        image_path = f"{IMAGES_DIRECTORY}{path}"
        if image_path in json_dict:
            print(f"Found {image_path} in json colors file, skipping...")
            continue

        file_stem = Path(path).stem
        image = load_image(path=image_path)
        k_means_list = fit_k_means_for_range(image, 1, 10)
        save_k_means_json(
            k_means=k_means_list,
            image_path=Path(image_path),
            file_path=Path(SAVED_COLOR_CLUSTERS_FILE),
        )
        # numbers_of_clusters, inertias = get_numbers_of_clusters_and_inertias(
        #     k_means_list
        # )
        # plot_line_chart(
        #     numbers_of_clusters,
        #     inertias,
        #     file_name=f"{plot_directory}/{file_stem}-line.png",
        # )
        # knee = get_knee_point(
        #     x=numbers_of_clusters,
        #     y=inertias,
        #     sensitivity=5.0,
        #     curvature="convex",
        #     slope="decreasing",
        # )
        for k, i in k_means_list:

            plot_k_means_pie_chart(
                k, file_name=f"{plot_directory}/{file_stem}-pie-{i}.png"
            )


if __name__ == "__main__":
    main(IMAGES_DIRECTORY, PLOTS_DIRECTORY, SAVED_COLOR_CLUSTERS_FILE)
