#!/usr/bin/env python
"""
Functions for k-means color clustering on images
"""

from os import listdir
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
import cv2
from sklearn.cluster import KMeans

IMAGES_DIRECTORY = './../../data/images/'
PLOTS_DIRECTORY = '../../data/plots'

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
    k_means = KMeans(n_clusters = number_of_clusters)
    k_means.fit(data)

    return k_means

def plot_k_means_pie_chart(k_means, file_name):
    """Take a k_means object and save a pie chart of color clusters to disk

    :k_means: A fitted KMeans object from sklearn.cluster.KMeans
    :file_name: File name of the pie chart
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
            colors = np.array(centroids / 255),
            labels = np.arange(len(centroid_percentages)))
    # plt.show()
    plt.savefig(file_name)


def main(directory, plot_directory):
    """Color cluster images with k-means and persist centroid pie charts

    :directory: Directory containing images to be processed
    :plot_directory: Directory to save plots (without trailing /)
    :returns: None

    """
    paths = listdir(directory)
    for path in paths:
        image = load_image(path = f"{IMAGES_DIRECTORY}{path}")
        # TODO: Currently hardcoded k, save k for each image in json somewhere
        k_means = fit_k_means(image, 8)
        file_stem = Path(path).stem
        plot_k_means_pie_chart(
            k_means,
            file_name = f"{plot_directory}/{file_stem}-pie.png")

if __name__ == '__main__':
    main(IMAGES_DIRECTORY, PLOTS_DIRECTORY)
